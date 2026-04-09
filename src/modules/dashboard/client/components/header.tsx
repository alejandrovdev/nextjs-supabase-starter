'use client';

import { ThemeToggle } from '@/components/theme-toggle';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  // Bell,
  // Command,
  // MessageSquare,
  // MoreVertical,
  // Settings,
  // Search,
  ChartArea,
} from 'lucide-react';

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex w-full items-center gap-2 border-b bg-card px-3 py-3 sm:gap-3 sm:px-6 sm:py-4">
      <SidebarTrigger className="-ml-1 sm:-ml-2" />

      <div className="flex flex-1 items-center gap-2 sm:gap-3">
        <ChartArea className="hidden size-5 text-muted-foreground sm:block sm:size-6" />

        <h1 className="truncate text-base font-medium sm:text-lg">Dashboard</h1>
      </div>

      {/* <div className="hidden md:block relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />

        <Input
          placeholder="Search Anything..."
          className="pl-10 pr-14 w-[180px] lg:w-[220px] h-9 bg-card border"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-muted px-1 py-0.5 rounded text-xs text-muted-foreground">
          <Command className="size-3" />

          <span>K</span>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative size-9">
              <Bell />

              <span className="absolute -top-0.5 -right-0.5 size-2.5 bg-rose-500 rounded-full border-2 border-card" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>

              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              >
                Mark all as read
              </Button>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer">
              <Avatar className="size-8 mt-0.5">
                <AvatarImage src="https://api.dicebear.com/9.x/glass/svg?seed=Alex" />

                <AvatarFallback>AR</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">New lead assigned</p>

                <p className="text-xs text-muted-foreground">
                  Alex Ray assigned you a new lead
                </p>

                <p className="text-xs text-muted-foreground">2 min ago</p>
              </div>

              <span className="size-2 bg-blue-500 rounded-full mt-2" />
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer">
              <Avatar className="size-8 mt-0.5">
                <AvatarImage src="https://api.dicebear.com/9.x/glass/svg?seed=Mina" />

                <AvatarFallback>MS</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Lead status updated</p>

                <p className="text-xs text-muted-foreground">
                  Mina Swan changed status to Qualified
                </p>

                <p className="text-xs text-muted-foreground">15 min ago</p>
              </div>

              <span className="size-2 bg-blue-500 rounded-full mt-2" />
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer opacity-60">
              <Avatar className="size-8 mt-0.5">
                <AvatarImage src="https://api.dicebear.com/9.x/glass/svg?seed=John" />

                <AvatarFallback>JK</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Comment added</p>

                <p className="text-xs text-muted-foreground">
                  John Kim commented on Lead #LD21305
                </p>

                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="justify-center text-sm text-muted-foreground">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="size-9">
              <MessageSquare />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Messages</span>

              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              >
                <Settings className="size-3.5 mr-1" />
                Settings
              </Button>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer">
              <Avatar className="size-8 mt-0.5">
                <AvatarImage src="https://api.dicebear.com/9.x/glass/svg?seed=Sarah" />

                <AvatarFallback>SL</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Sarah Lee</p>

                  <span className="text-xs text-muted-foreground">5m</span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  Hey, can you check the new lead from Acme Corp? They seem
                  interested...
                </p>
              </div>

              <span className="size-2 bg-blue-500 rounded-full mt-2" />
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer">
              <Avatar className="size-8 mt-0.5">
                <AvatarImage src="https://api.dicebear.com/9.x/glass/svg?seed=Alex" />
                <AvatarFallback>AR</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Alex Ray</p>
                  <span className="text-xs text-muted-foreground">1h</span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  The meeting with TechStart is confirmed for tomorrow at 2 PM
                </p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer opacity-60">
              <Avatar className="size-8 mt-0.5">
                <AvatarImage src="https://api.dicebear.com/9.x/glass/svg?seed=Mina" />
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Mina Swan</p>

                  <span className="text-xs text-muted-foreground">2d</span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  Thanks for the update! I&apos;ll follow up with them next
                  week.
                </p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="justify-center text-sm text-muted-foreground">
              View all messages
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      */}

      <ThemeToggle />

      {/*
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="sm:hidden h-8 w-8">
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuItem>
            <Search className="size-4 mr-2" />
            Search
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Bell className="size-4 mr-2" />
            Notifications
          </DropdownMenuItem>

          <DropdownMenuItem>
            <MessageSquare className="size-4 mr-2" />
            Messages
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </header>
  );
}
