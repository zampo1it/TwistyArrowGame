"use client";
import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [best, setBest] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bestLevel");
      if (saved) {
        const parsed = parseInt(saved);
        setBest(parsed);
        setSelectedLevel(parsed); // выделим последний доступный
      }
    }
  }, []);

  // Сохраняем выбранный уровень при нажатии START
  const handleStart = () => {
    if (selectedLevel !== null) {
      localStorage.setItem("currentLevel", selectedLevel.toString());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff6de]">
      <div className="text-center max-w-3xl px-4 py-16">
        <div className="mb-8 flex justify-center">
          <Target className="h-24 w-24 text-red-500" strokeWidth={1.5} />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-800">
          Twisty Arrow Game
        </h1>

        {/* Уровни */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {Array.from({ length: 10 }, (_, i) => {
            const level = i + 1;
            const isUnlocked = level <= best;
            const isActive = level === selectedLevel;

            return (
              <button
                key={i}
                onClick={() => {
                  if (isUnlocked) setSelectedLevel(level);
                }}
                className={`
                  w-10 h-10 flex items-center justify-center text-sm font-bold border rounded transition-all
                  ${
                    isUnlocked
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                  ${isActive && isUnlocked ? "ring-2 ring-yellow-400" : ""}
                `}
                disabled={!isUnlocked}
              >
                {level}
              </button>
            );
          })}
        </div>

        {/* Кнопка */}
        <Link
          href="/game"
          onClick={handleStart}
          className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all transform hover:scale-105 shadow-lg"
        >
          PLAY
          <ArrowRight className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
}
