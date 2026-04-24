import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );
};

export const CardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
    <div className="flex items-center justify-between">
      <div className="space-y-3 w-2/3">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="w-12 h-12 rounded-xl" />
    </div>
  </div>
);

export const TableRowSkeleton = ({ columns = 5 }: { columns?: number }) => (
  <tr className="animate-pulse">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </td>
    ))}
  </tr>
);

export const ListSkeleton = ({ items = 5 }: { items?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-100">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export const SidebarSkeleton = ({ isCollapsed = false }: { isCollapsed?: boolean }) => (
  <div className={`h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-56'}`}>
    <div className="h-14 flex-shrink-0 flex items-center justify-between border-b border-gray-200 px-3">
      <div className="flex items-center gap-2">
        <Skeleton className="w-7 h-7 rounded-lg" />
        {!isCollapsed && <Skeleton className="h-4 w-24" />}
      </div>
    </div>
    <div className="flex-1 p-2 space-y-6 overflow-hidden">
      {[1, 2, 3].map((section) => (
        <div key={section} className="space-y-3">
          {!isCollapsed && <Skeleton className="h-3 w-16 mx-2" />}
          <div className="space-y-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center px-3 py-2 space-x-3">
                <Skeleton className="w-5 h-5 rounded-lg flex-shrink-0" />
                {!isCollapsed && <Skeleton className="h-4 w-full rounded" />}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div className="border-t border-gray-200 p-2 space-y-2">
      <div className="flex items-center px-3 py-2 space-x-3">
        <Skeleton className="w-5 h-5 rounded-lg flex-shrink-0" />
        {!isCollapsed && <Skeleton className="h-4 w-16 rounded" />}
      </div>
      <div className="flex items-center px-3 py-2 space-x-3">
        <Skeleton className="w-5 h-5 rounded-lg flex-shrink-0" />
        {!isCollapsed && <Skeleton className="h-4 w-16 rounded" />}
      </div>
    </div>
  </div>
);
