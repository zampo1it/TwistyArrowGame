"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function BackButton() {
  const pathname = usePathname();

  return (
    <Link
      href="/leaderboard"
      className="fixed bottom-4 right-4 z-50 w-10 h-10"
    >
      <img
        src="/assets/images/scoreboard.png"
        alt="Назад"
        className="w-full h-full object-contain cursor-pointer hover:scale-110 transition-transform"
      />
    </Link>
  );
}
