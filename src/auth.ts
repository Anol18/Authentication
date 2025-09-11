// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { z } from "zod";
import { signin } from "./actions/signin";
import crypto from "crypto";
import type { NextAuthConfig, User, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Validation schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password must be at least 1 character"),
});

// Extended User type
interface ExtendedUser extends User {
  id: string;
  username: string;
  email: string;
  permission: string;
  token: string;
  sessionId?: string;
  fingerprint?: string;
  ip?: string;
}

// Extended JWT type
interface ExtendedJWT extends JWT {
  id: string;
  username: string;
  email: string;
  permission: string;
  apiToken: string;
  sessionId: string;
  fingerprint: string;
  ip: string;
  createdAt: number;
}

// Extended Session type
interface ExtendedSession extends Session {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    permission: string;
    token: string;
    sessionId: string;
  };
}

type DecodedToken = {
  id: string;
  username: string;
  email: string;
  permission: string;
};

// In-memory store for active sessions and security info
const activeSessions = new Map<
  string,
  {
    fingerprint: string;
    ip: string;
    lastActivity: number;
    userId: string;
  }
>();

const config: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter your username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      authorize: async (credentials, request): Promise<ExtendedUser | null> => {
        try {
          // Validate credentials
          const { username, password } = loginSchema.parse(credentials);
          // const contentType = request.headers?.get("content-type");
          // console.log("contentType",contentType);
          // request.headers.set("content-type", "application/json");
          // Get user from database
          const response = await signin({
            username,
            password,
          });

          if (!response?.isValid || !response?.token) {
            return null;
          }

          const decodedToken: DecodedToken = jwtDecode(response.token);

          const user: ExtendedUser = {
            id: decodedToken.id,
            name: decodedToken.username,
            username: decodedToken.username,
            email: decodedToken.email,
            permission: decodedToken.permission,
            token: response.token,
          };

          // Generate security fingerprint
          if (request) {
            const fingerprint = generateFingerprint(request);
            const ip = getClientIP(request);

            // Store session security info
            const sessionId = crypto.randomUUID();
            activeSessions.set(sessionId, {
              fingerprint,
              ip,
              lastActivity: Date.now(),
              userId: user.id,
            });

            // Add security info to user object
            user.sessionId = sessionId;
            user.fingerprint = fingerprint;
            user.ip = ip;
          }

          return user;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],

  // Configure session strategy
  session: {
    strategy: "jwt",
    maxAge: 15 * 60, // 15 minutes
  },

  // JWT configuration
  jwt: {
    maxAge: 15 * 60, // 15 minutes
  },

  // Callbacks
  callbacks: {
    async jwt({ token, user, trigger }): Promise<ExtendedJWT> {
      if (user) {
        const extendedUser = user as ExtendedUser;
        token.id = extendedUser.id;
        token.username = extendedUser.username;
        token.email = extendedUser.email;
        token.permission = extendedUser.permission;
        token.apiToken = extendedUser.token;

        // Add security information to token
        token.sessionId = extendedUser.sessionId || "";
        token.fingerprint = extendedUser.fingerprint || "";
        token.ip = extendedUser.ip || "";
        token.createdAt = Date.now();
      }

      // Update last activity for existing sessions
      if (token.sessionId && trigger === "update") {
        const session = activeSessions.get(String(token.sessionId));
        if (session) {
          session.lastActivity = Date.now();
        }
      }

      return token as ExtendedJWT;
    },

    async session({ session, token }): Promise<ExtendedSession> {
      if (token) {
        const extendedToken = token as ExtendedJWT;
        const extendedSession = session as unknown as ExtendedSession;

        extendedSession.user.id = extendedToken.id;
        extendedSession.user.name = extendedToken.username;
        extendedSession.user.email = extendedToken.email;
        extendedSession.user.permission = extendedToken.permission;
        extendedSession.user.token = extendedToken.apiToken;
        extendedSession.user.sessionId = extendedToken.sessionId;

        return extendedSession;
      }
      return session as unknown as ExtendedSession;
    },

    // Enhanced authorized callback with security checks
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { nextUrl } = request;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        if (!isLoggedIn) {
          return false; // Redirect to login
        }

        // Additional security checks for logged-in users
        const currentFingerprint = generateFingerprint(request);
        const currentIP = getClientIP(request);
        const sessionId = (auth.user as ExtendedUser).sessionId;

        if (sessionId) {
          const storedSession = activeSessions.get(sessionId);

          if (!storedSession) {
            // Session not found in store
            console.log("Session not found in active sessions store");
            return false;
          }

          // Check if fingerprint matches
          if (storedSession.fingerprint !== currentFingerprint) {
            console.log("Browser fingerprint mismatch detected");
            // Uncomment to enforce fingerprint matching
            // return false;
          }

          // Check if IP changed (careful - users can have dynamic IPs)
          if (
            process.env.NODE_ENV === "production" &&
            storedSession.ip !== currentIP
          ) {
            console.log("IP address change detected", {
              stored: storedSession.ip,
              current: currentIP,
            });
            // Uncomment to enforce IP matching
            // return false;
          }

          // Check for session timeout due to inactivity
          const maxInactiveTime = 30 * 60 * 1000; // 30 minutes
          if (Date.now() - storedSession.lastActivity > maxInactiveTime) {
            console.log("Session expired due to inactivity");
            activeSessions.delete(sessionId);
            return false;
          }

          // Update last activity
          storedSession.lastActivity = Date.now();
        }

        return true;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },

    async signOut({ token }: { token: { sessionId?: string } }) {
      if (token?.sessionId && typeof token.sessionId === "string") {
        activeSessions.delete(token.sessionId);
        console.log("Session cleaned up on signout");
      }
      return true;
    },
  },

  // Pages configuration
  pages: {
    signIn: "/",
    error: "/auth/error",
  },

  // Enhanced security configuration
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}${
        process.env.COOKIE_NAME
      }`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        // Additional security flags
        // domain: process.env.NODE_ENV === 'production' ? '.http://localhost:3000' : undefined,
      },
    },
  },

  // Security configuration

  secret: process.env.AUTH_SECRET,

  // basePath:process.env.AUTH_URL
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);

// Security helper functions
function generateFingerprint(request: Request): string {
  const userAgent = request.headers.get("user-agent") || "";
  const acceptLanguage = request.headers.get("accept-language") || "";
  const acceptEncoding = request.headers.get("accept-encoding") || "";

  // Create a fingerprint based on browser characteristics
  const fingerprint = crypto
    .createHash("sha256")
    .update(userAgent + acceptLanguage + acceptEncoding)
    .digest("hex");

  return fingerprint;
}

function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return realIP || "unknown";
}

// Utility function to invalidate all sessions for a user

export async function invalidateUserSessions(userId: string): Promise<void> {
  for (const [sessionId, session] of activeSessions.entries()) {
    if (session.userId === userId) {
      activeSessions.delete(sessionId);
    }
  }
}

// Utility function to get active session count for a user
export function getUserActiveSessionCount(userId: string): number {
  let count = 0;
  for (const session of activeSessions.values()) {
    if (session.userId === userId) {
      count++;
    }
  }
  return count;
}

// Cleanup old sessions periodically
setInterval(() => {
  const now = Date.now();
  const maxAge = 15 * 60 * 1000; // 15 minutes

  for (const [sessionId, session] of activeSessions.entries()) {
    if (now - session.lastActivity > maxAge) {
      activeSessions.delete(sessionId);
    }
  }
}, 5 * 60 * 1000); // Run every 5 minutes
