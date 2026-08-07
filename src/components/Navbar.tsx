"use client";

const iconProps = {
  width: 18,
  height: 18,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-neutral-200 bg-white">
      <nav className="relative mx-auto flex h-full max-w-[1600px] items-center justify-between px-5 md:px-8">
        {/* Left — menu / shop */}
        <div className="flex items-center gap-5">
          <button
            aria-label="Menu"
            className="flex h-8 w-8 flex-col items-start justify-center gap-[5px] text-black"
          >
            <span className="block h-px w-[18px] bg-current" />
            <span className="block h-px w-[12px] bg-current" />
          </button>
          <a
            href="#shop"
            className="hidden text-[11px] font-medium tracking-[0.22em] text-black md:block"
          >
            SHOP
          </a>
        </div>

        {/* Center — wordmark */}
        <a
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[17px] font-bold tracking-[0.34em] text-black"
        >
          LEAP
        </a>

        {/* Right — account / search / cart */}
        <div className="flex items-center gap-4 text-black md:gap-5">
          <button aria-label="Account" className="hidden md:block">
            <svg viewBox="0 0 24 24" {...iconProps}>
              <circle cx="12" cy="8" r="3.6" />
              <path d="M4.5 20c1.4-3.4 4.2-5 7.5-5s6.1 1.6 7.5 5" />
            </svg>
          </button>
          <button aria-label="Search">
            <svg viewBox="0 0 24 24" {...iconProps}>
              <circle cx="11" cy="11" r="6.5" />
              <path d="m20 20-4.4-4.4" />
            </svg>
          </button>
          <button aria-label="Cart">
            <svg viewBox="0 0 24 24" {...iconProps}>
              <path d="M5 8h14l-1 12H6L5 8Z" />
              <path d="M9 8V6.8A3 3 0 0 1 15 6.8V8" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
