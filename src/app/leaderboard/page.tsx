"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type LeaderEntry = {
  name: string;
  score: number;
};

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);

  useEffect(() => {
    const storedLeaders = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    setLeaders(storedLeaders);
  }, []);

  const clearLeaderboard = () => {
    localStorage.removeItem("leaderboard");
    setLeaders([]);
  };

  return (
    <div className="min-h-screen bg-[#fff6de] text-black p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">🏆 Leaderboard</h1>

      <table className="table-auto border-collapse w-full max-w-xl bg-white shadow-md rounded overflow-hidden mb-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border-b">#</th>
            <th className="p-2 border-b">Name</th>
            <th className="p-2 border-b">Score</th>
          </tr>
        </thead>
        <tbody>
          {leaders
            .sort((a, b) => b.score - a.score)
            .map((entry, idx) => (
              <tr key={idx} className="text-center">
                <td className="p-2 border-b">{idx + 1}</td>
                <td className="p-2 border-b">{entry.name}</td>
                <td className="p-2 border-b">{entry.score}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="flex gap-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={clearLeaderboard}
        >
          Clear Leaderboard
        </button>

        <Link
          href="/game"
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Back to Game
        </Link>
      </div>
    </div>
  );
}
