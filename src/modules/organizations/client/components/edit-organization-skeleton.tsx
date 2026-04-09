import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/shadcn/utils';

export function EditOrganizationSkeleton({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-8 w-[180px]" />
        <Skeleton className="h-5 w-[300px]" />
      </div>

      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-10" />
          <div className="mb-4 flex items-center justify-center gap-4">
            <Skeleton className="h-[120px] w-[120px] rounded-full" />
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-17 w-full" />
        </div>
      </div>

      <Skeleton className="mb-3 h-9 w-full" />

      <div className="flex justify-center">
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
