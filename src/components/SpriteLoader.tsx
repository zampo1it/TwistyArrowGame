"use client";

import React, { useRef, useState } from "react";

const SpriteLoader = () => {
  const [bowName, setBowName] = useState("Файл не выбран");
  const [arrowName, setArrowName] = useState("Файл не выбран");
  const [circleName, setCircleName] = useState("Файл не выбран");
  const [changesPending, setChangesPending] = useState(false);

  const pendingUploadsRef = useRef<Promise<void>[]>([]);

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    storageKey: string,
    setName: (name: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadPromise = new Promise<void>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const isBow = storageKey === "customBow";
          const isArrow = storageKey === "customArrow";
          const isTarget = storageKey === "customCircle";

          const targetWidth = isTarget ? 480 : isBow ? 1500 : 128;
          const targetHeight = isTarget ? 480 : isBow ? 800 : 128;

          const w = targetWidth;
          const h = targetHeight;

          canvas.width = w;
          canvas.height = h;

          if (isTarget && ctx) {
            ctx.beginPath();
            ctx.arc(w / 2, h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
            ctx.clip();
          }

          ctx?.drawImage(img, 0, 0, w, h);
          const dataURL = canvas.toDataURL("image/png");
          localStorage.setItem(storageKey, dataURL);

          if (isBow) {
            localStorage.setItem("customBowUsed", "true");
          }

          setName(file.name);
          setChangesPending(true);
          resolve();
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });

    pendingUploadsRef.current.push(uploadPromise);

    e.target.value = "";
  };

  const applyChanges = async () => {
    const uploads = [...pendingUploadsRef.current];
    pendingUploadsRef.current = [];

    if (uploads.length === 0) return;

    await Promise.all(uploads);
    location.reload();
  };

  const reset = () => {
    localStorage.removeItem("customBow");
    localStorage.removeItem("customArrow");
    localStorage.removeItem("customCircle");
    localStorage.removeItem("customBowUsed");
    location.reload();
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 text-sm text-white flex flex-col gap-2 items-center">
      <div className="flex gap-4">
        <label>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleUpload(e, "customBow", setBowName)}
          />
          <span className="bg-black/60 px-3 py-1 rounded cursor-pointer hover:bg-black/80">
            Bow
          </span>
        </label>
        <label>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleUpload(e, "customArrow", setArrowName)}
          />
          <span className="bg-black/60 px-3 py-1 rounded cursor-pointer hover:bg-black/80">
            Arrow
          </span>
        </label>
        <label>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleUpload(e, "customCircle", setCircleName)}
          />
          <span className="bg-black/60 px-3 py-1 rounded cursor-pointer hover:bg-black/80">
            Target
          </span>
        </label>
      </div>

      {changesPending && (
        <button
          onClick={applyChanges}
          className="mt-2 bg-white text-black font-semibold px-4 py-1 rounded hover:bg-gray-200"
        >
          Apply
        </button>
      )}

      <button
        onClick={reset}
        className="mt-1 text-xs underline underline-offset-2 text-black/60 hover:text-pink-500"
      >
        Reset to default
      </button>
    </div>
  );
};

export default SpriteLoader;