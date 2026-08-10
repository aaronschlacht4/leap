"use client";

import CanvasArt, { type ArtDesign } from "@/components/CanvasArt";

const PRODUCTS: { name: string; price: string; design: ArtDesign; framed?: boolean }[] = [
  { name: "Macintosh 1984", price: "$329", design: "macintosh" },
  { name: "Ambition Arches", price: "$189", design: "arches" },
  { name: "Make It Yours No. 1", price: "$209", design: "typographic", framed: true },
  { name: "Morning Light", price: "$189", design: "sunline" },
];

export default function StoreSections() {
  return (
    <>
      {/* Best sellers */}
      <section id="shop" className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
        <div className="mb-10 flex items-end justify-between md:mb-14">
          <h2 className="text-xl font-bold tracking-[0.14em] text-black md:text-2xl">
            BEST SELLERS
          </h2>
          <a
            href="#"
            className="border-b border-black pb-0.5 text-[11px] font-semibold tracking-[0.2em] text-black"
          >
            VIEW ALL
          </a>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-8">
          {PRODUCTS.map((p) => (
            <a key={p.name} href="#" className="group block">
              <div className="border border-neutral-200 bg-[#FAF9F6] p-[12%]">
                <div className="aspect-[10/13] w-full overflow-hidden shadow-[0_6px_16px_rgba(58,46,30,0.10)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]">
                  <CanvasArt design={p.design} framed={p.framed} />
                </div>
              </div>
              <p className="mt-4 text-[11px] font-semibold tracking-[0.18em] text-black">
                {p.name.toUpperCase()}
              </p>
              <p className="mt-1 text-[12px] text-neutral-500">{p.price}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Editorial statement */}
      <section className="border-y border-neutral-200">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-20 md:grid-cols-2 md:items-center md:gap-16 md:px-8 md:py-28">
          <h2 className="text-[clamp(2rem,4.5vw,3.75rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-black">
            ART FOR WALLS
            <br />
            WITH AMBITION.
          </h2>
          <div className="max-w-md">
            <p className="text-[15px] font-light leading-relaxed text-neutral-700">
              Gallery-quality canvas, stretched by hand and ready to hang the
              moment it arrives. One piece is all it takes for a room to stop
              being a container and start being yours.
            </p>
            <a
              href="#shop"
              className="mt-8 inline-block border-b border-black pb-0.5 text-[11px] font-semibold tracking-[0.24em] text-black"
            >
              SHOP CANVAS ART
            </a>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-[1400px] px-5 py-14 md:px-8">
        <div className="grid gap-8 text-center md:grid-cols-3">
          {[
            ["FREE SHIPPING", "On every order, worldwide."],
            ["READY TO HANG", "Arrives stretched, hardware included."],
            ["100-DAY RETURNS", "Live with it. Love it, or send it back."],
          ].map(([title, copy]) => (
            <div key={title}>
              <p className="text-[11px] font-semibold tracking-[0.24em] text-black">{title}</p>
              <p className="mt-2 text-[13px] font-light text-neutral-500">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-10 px-5 py-14 md:flex-row md:items-center md:px-8">
          <p className="text-[15px] font-bold tracking-[0.34em] text-black">LEAP</p>
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {["SHOP", "ABOUT", "SUPPORT", "INSTAGRAM"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-[11px] font-medium tracking-[0.2em] text-neutral-600 hover:text-black"
              >
                {link}
              </a>
            ))}
          </nav>
          <p className="text-[11px] font-light tracking-[0.06em] text-neutral-400">
            © {new Date().getFullYear()} LEAP. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
