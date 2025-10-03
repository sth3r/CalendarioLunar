"use client";

import LunarCalendar from '@/components/ui/LunarCalendar';
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center  from-indigo-950 via-purple-900 to-black">
      <div className="w-full max-w-3xl">
        <LunarCalendar />
      </div>
    </main>
  );
}