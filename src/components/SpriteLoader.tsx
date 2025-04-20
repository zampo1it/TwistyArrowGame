"use client";

import { useRef, useState, useEffect } from "react";

export default function SpriteLoader() {
  const bowInputRef = useRef<HTMLInputElement>(null);
  const arrowInputRef = useRef<HTMLInputElement>(null);
  const circleInputRef = useRef<HTMLInputElement>(null);

  const [bowName, setBowName] = useState("No file chosen");
  const [arrowName, setArrowName] = useState("No file chosen");
  const [circleName, setCircleName] = useState("No file chosen");
  const [hasCustom, setHasCustom] = useState(false);

  useEffect(() => {
    const bow = localStorage.getItem("customBow");
    const arrow = localStorage.getItem("customArrow");
    const circle = localStorage.getItem("customCircle");
    if (bow || arrow || circle) {
      setHasCustom(true);
    }
  }, []);

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    storageKey: string,
    setName: (name: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const isBow = storageKey === "customBow";
        const isArrow = storageKey === "customArrow";
        const isCircle = storageKey === "customCircle";

        const targetWidth = isCircle ? 480 : isBow ? 1500 : 128;
        const targetHeight = isCircle ? 480 : isBow ? 800 : 128;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const scale = Math.min(targetWidth / img.width, targetHeight / img.height);
        const w = img.width * scale;
        const h = img.height * scale;

        ctx?.clearRect(0, 0, targetWidth, targetHeight);

        if (isCircle) {
          ctx?.save();
          ctx?.beginPath();
          ctx?.arc(targetWidth / 2, targetHeight / 2, targetWidth / 2, 0, Math.PI * 2);
          ctx?.clip();
        }

        if (isBow) {
          ctx?.translate(targetWidth / 2, targetHeight / 2);
          ctx?.drawImage(img, -w / 2, -h / 2, w, h);
        } else {
          const x = (targetWidth - w) / 2;
          const y = (targetHeight - h) / 2;
          ctx?.drawImage(img, x, y, w, h);
        }

        if (isCircle) {
          ctx?.restore();
        }

        const resizedDataUrl = canvas.toDataURL("image/png");
        localStorage.setItem(storageKey, resizedDataUrl);

        if (isBow) {
          localStorage.setItem("customBowUsed", "true");
        }

        setHasCustom(true);
        setName(file.name);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const applyChanges = () => {
    location.reload();
  };

  const resetDefaults = () => {
    localStorage.removeItem("customBow");
    localStorage.removeItem("customArrow");
    localStorage.removeItem("customCircle");
    localStorage.removeItem("customBowUsed");
    location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-4 bg-white bg-opacity-90 p-4 rounded shadow-lg text-black text-sm">
      <div className="flex flex-col gap-1">
        <span>Upload Bow:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => bowInputRef.current?.click()}
            className="px-2 py-1 bg-black text-white rounded"
          >
            Choose file
          </button>
          <span className="text-xs text-gray-600">{bowName}</span>
        </div>
        <input
          type="file"
          ref={bowInputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => handleUpload(e, "customBow", setBowName)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <span>Upload Arrow:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => arrowInputRef.current?.click()}
            className="px-2 py-1 bg-black text-white rounded"
          >
            Choose file
          </button>
          <span className="text-xs text-gray-600">{arrowName}</span>
        </div>
        <input
          type="file"
          ref={arrowInputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => handleUpload(e, "customArrow", setArrowName)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <span>Upload Circle:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => circleInputRef.current?.click()}
            className="px-2 py-1 bg-black text-white rounded"
          >
            Choose file
          </button>
          <span className="text-xs text-gray-600">{circleName}</span>
        </div>
        <input
          type="file"
          ref={circleInputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => handleUpload(e, "customCircle", setCircleName)}
        />
      </div>

      <div className="flex gap-2 mt-2">
        {hasCustom && (
          <button
            onClick={applyChanges}
            className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            Apply
          </button>
        )}
        <button
          onClick={resetDefaults}
          className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}