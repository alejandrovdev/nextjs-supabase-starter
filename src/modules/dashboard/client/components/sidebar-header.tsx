import { SidebarHeader } from '@/components/ui/sidebar';
import Image from 'next/image';

export function DashboardSidebarHeader() {
  return (
    <SidebarHeader className="p-3 pb-0 sm:p-4 lg:p-5">
      <div className="flex items-center gap-2">
        <Image
          src="/next.svg"
          alt="Next.js Supabase Starter"
          width={100}
          height={20}
          className="dark:invert"
          priority
        />
      </div>
    </SidebarHeader>
  );
}
