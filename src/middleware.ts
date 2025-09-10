// middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Cleanup old rate limit entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

function rateLimit(ip: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const key = `rate_limit:${ip}`;
  
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= limit) {
    return false;
  }
  
  current.count++;
  return true;
}

function getClientIP(request: NextRequest): string {
  // Check multiple possible headers for the real IP
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip"); // Cloudflare
  const xVercelForwardedFor = request.headers.get("x-vercel-forwarded-for"); // Vercel
  
  // Priority order: CF-Connecting-IP, X-Vercel-Forwarded-For, X-Forwarded-For, X-Real-IP
  if (cfConnectingIP) {
    return cfConnectingIP.trim();
  }
  
  if (xVercelForwardedFor) {
    return xVercelForwardedFor.split(",")[0].trim();
  }
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  return realIP || "unknown";
}

function isStaticAsset(pathname: string): boolean {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'];
  return staticExtensions.some(ext => pathname.endsWith(ext));
}

function shouldSkipAuth(pathname: string): boolean {
  const skipPaths = [
    '/api/auth', // NextAuth routes
    '/auth/error',
    '/auth/signin',
    '/_next',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml'
  ];
  
  return skipPaths.some(path => pathname.startsWith(path)) || isStaticAsset(pathname);
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIP = getClientIP(request);
  
  try {
    // Skip rate limiting and auth for static assets and auth routes
    if (shouldSkipAuth(pathname)) {
      const response = NextResponse.next();
      addSecurityHeaders(response, false); // Less strict headers for static assets
      return response;
    }
    
    // Apply rate limiting with different limits for different routes
    let rateLimit_limit = 50; // Default: 50 requests per minute
    let windowMs = 60000; // 1 minute
    
    // Stricter rate limiting for auth routes
    if (pathname.startsWith('/api/auth/signin') || pathname.startsWith('/api/auth/callback')) {
      rateLimit_limit = 10; // 10 attempts per minute for auth
      windowMs = 60000;
    }
    
    // Even stricter for sensitive routes
    if (pathname.includes('admin') || pathname.includes('settings')) {
      rateLimit_limit = 20; // 20 requests per minute
    }
    
    if (!rateLimit(clientIP, rateLimit_limit, windowMs)) {
      console.warn(`Rate limit exceeded for IP ${clientIP} on ${pathname}`);
      return new NextResponse(
        JSON.stringify({ 
          error: "Too many requests",
          message: "Please wait before making more requests"
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
            "X-RateLimit-Limit": rateLimit_limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": Math.ceil(Date.now() / 1000 + 60).toString(),
          },
        }
      );
    }

    // Get session with error handling
    let session;
    try {
      session = await auth();
    } catch (error) {
      console.error("Auth error in middleware:", error);
      // Continue without session rather than blocking the request
      session = null;
    }
    
    // Create response
    const response = NextResponse.next();
    
    // Add comprehensive security headers
    addSecurityHeaders(response, true);
    
    // Add rate limit info to headers
    const remaining = Math.max(0, rateLimit_limit - (rateLimitStore.get(`rate_limit:${clientIP}`)?.count || 0));
    response.headers.set("X-RateLimit-Limit", rateLimit_limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());

    // Additional logging for security monitoring
    if (session?.user) {
      const userId = 'id' in session.user ? session.user.id : 'unknown';
      console.log(`Auth request from ${clientIP} for user ${userId} to ${pathname}`);
      
      // Log suspicious activity
      if (pathname.includes('admin') || pathname.includes('settings')) {
        console.log(`Admin access attempt from ${clientIP} by user ${userId}`);
      }
    } else if (pathname.startsWith('/dashboard')) {
      console.log(`Unauthenticated request to protected route ${pathname} from ${clientIP}`);
    }

    return response;
    
  } catch (error) {
    console.error("Middleware error:", error);
    
    // Return a basic response with security headers if middleware fails
    const response = NextResponse.next();
    addSecurityHeaders(response, true);
    return response;
  }
}

function addSecurityHeaders(response: NextResponse, strict: boolean = true): void {
  // Basic security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  
  if (strict) {
    // Strict permissions policy
    response.headers.set(
      "Permissions-Policy", 
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()"
    );
    
    if (process.env.NODE_ENV === 'production') {
      // HSTS header
      response.headers.set(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains; preload"
      );
      
      // More restrictive CSP for production
      response.headers.set(
        "Content-Security-Policy",
        [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Adjust as needed for your app
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https:",
          "font-src 'self' data:",
          "connect-src 'self'",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'"
        ].join("; ")
      );
    }
  } else {
    // Less strict permissions for static assets
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth internal routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, sitemap.xml (common static files)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ]
}