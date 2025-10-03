import LunarCalendar from '@/components/LunarCalendar';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center  from-indigo-950 via-purple-900 to-black">
      {/* <meta name="google-adsense-account" content="ca-pub-3729829871518422"></meta> */}
      <div className="w-full max-w-3xl">
        <LunarCalendar />
      </div>
    </main>
  );
}