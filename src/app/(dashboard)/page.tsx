import { HomeToastListener } from '@/modules/dashboard/components/home-toast-listener';

export default function HomePage() {
  return (
    <div className="flex h-svh w-full items-center justify-center gap-2">
      <HomeToastListener />
      Home Page
    </div>
  );
}
