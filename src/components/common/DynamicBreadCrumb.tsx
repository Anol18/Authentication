"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // App Router (Next.js 13+)
// import { useRouter } from 'next/router'; // Pages Router (Next.js 12 and below)
import { ChevronRight, Home } from 'lucide-react';
import React from 'react';

interface BreadcrumbProps {
  customPaths?: Record<string, string>;
  showHome?: boolean;
  homeIcon?: boolean;
  className?: string;
}

interface BreadcrumbItem {
  label: React.ReactNode;
  href: string;
  isCurrentPage: boolean;
}

const DynamicBreadcrumb: React.FC<BreadcrumbProps> = ({ 
  customPaths = {}, 
  showHome = true,
  homeIcon = true,
  className = "" 
}) => {
  // Get current path automatically from Next.js
  const pathname = usePathname();
  
  // For Pages Router, use this instead:
  // const router = useRouter();
  // const pathname = router.asPath;
  
  // Split path into segments
  const pathSegments: string[] = pathname.split('/').filter(Boolean);
  
  // Remove query parameters from the last segment
  if (pathSegments.length > 0) {
    pathSegments[pathSegments.length - 1] = pathSegments[pathSegments.length - 1].split('?')[0];
  }

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];

    // Add home breadcrumb
    if (showHome) {
      breadcrumbs.push({
        label: homeIcon ? <Home className="h-4 w-4" /> : 'Home',
        href: '/',
        isCurrentPage: pathSegments.length === 0
      });
    }

    // Generate breadcrumbs for each path segment
    pathSegments.forEach((segment: string, index: number) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const isCurrentPage = index === pathSegments.length - 1;
      
      // Use custom label if provided, otherwise format the segment
      const label: string = customPaths[href] || 
                           customPaths[segment] || 
                           segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ').replace(/_/g, ' ');

      breadcrumbs.push({
        label,
        href,
        isCurrentPage
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav aria-label="breadcrumb" className={`flex ${className}`}>
      <ol className="flex items-center space-x-1 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb: BreadcrumbItem, index: number) => (
          <React.Fragment key={crumb.href}>
            <li className={`inline-flex items-center ${index === 0 && homeIcon ? "" : "hidden md:block"}`}>
              {crumb.isCurrentPage ? (
                <span className="font-medium text-foreground">
                  {crumb.label}
                </span>
              ) : (
                <Link 
                  href={crumb.href} 
                  className="hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
            {index < breadcrumbs.length - 1 && (
              <ChevronRight className={`h-4 w-4 ${index === 0 && homeIcon ? "" : "hidden md:block"}`} />
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default DynamicBreadcrumb;