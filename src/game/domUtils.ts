export function createLevelDom(level: number): HTMLDivElement {
    const levelDiv = document.createElement("div");
    levelDiv.className = `
      level-counter
      fixed left-4 top-4
      bg-black rounded-md overflow-hidden
      border border-white/10 
      w-20 md:w-28 z-50
    `;
    levelDiv.innerHTML = `
      <div class="text-[10px] md:text-xs uppercase bg-white/10 px-2 md:px-3 py-1 text-white tracking-wider rounded-t-md border-b border-white/20 text-center">
        LEVEL
      </div>
      <div class="text-xl md:text-3xl font-bold text-white px-3 py-1 text-center">
        ${level}
      </div>
    `;
    document.body.appendChild(levelDiv);
    return levelDiv;
  }
  
  export function createBestDom(bestLevel: number): HTMLDivElement {
    const bestDiv = document.createElement("div");
    bestDiv.className = `
      best-counter
      fixed right-4 top-4
      bg-black rounded-md overflow-hidden
      border border-white/10 
      w-20 md:w-28 z-50
    `;
    bestDiv.innerHTML = `
      <div class="text-[10px] md:text-xs uppercase bg-white/10 px-2 md:px-3 py-1 text-white tracking-wider rounded-t-md border-b border-white/20 text-center">
        BEST
      </div>
      <div class="text-xl md:text-3xl font-bold text-white px-3 py-1 text-center">
        ${bestLevel}
      </div>
    `;
    document.body.appendChild(bestDiv);
    return bestDiv;
  }