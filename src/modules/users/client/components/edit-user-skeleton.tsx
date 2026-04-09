import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/shadcn/utils';

export function EditUserSkeleton({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-8 w-[180px]" />
        <Skeleton className="h-5 w-[300px]" />
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <Skeleton className="mb-3 h-9 w-full" />
    </div>
  );
}
