"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** playback begins (empty lit box holds for ~1.9s, then assembly) */
  play: boolean;
  /** jump straight to the finished piece (reduced motion) */
  skipToEnd?: boolean;
};

/**
 * The hero artwork: the framed Macintosh assembling inside its lit
 * gallery box — rendered in Blender EEVEE (blender_anim.py), so the
 * lighting, soft shadows, and depth of field are true render quality.
 * Seated on a dark matte so the lit box carries the frame. Plays once
 * and holds on the finished piece.
 */
export default function MacintoshFilm({ play, skipToEnd = false }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);
  const isVisible = play || skipToEnd;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (skipToEnd) {
      const toEnd = () => {
        video.currentTime = Math.max((video.duration || 6) - 0.05, 0);
      };
      if (video.readyState >= 1) toEnd();
      else video.addEventListener("loadedmetadata", toEnd, { once: true });
      return;
    }
    if (play && !startedRef.current) {
      startedRef.current = true;
      video.play().catch(() => {
        /* autoplay denied — the first frame stays visible */
      });
    }
  }, [play, skipToEnd]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#20201f]">
      <video
        ref={videoRef}
        src="/art/macintosh-assembly.mp4"
        muted
        playsInline
        preload="auto"
        aria-label="Framed Macintosh 1984 display assembling: computer, keyboard, and mouse arriving inside a lit gallery box, labeled The Personal Computer"
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* gentle vignette to seat the film in the page */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 105% at 50% 45%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.32) 100%)",
        }}
      />
    </div>
  );
}
