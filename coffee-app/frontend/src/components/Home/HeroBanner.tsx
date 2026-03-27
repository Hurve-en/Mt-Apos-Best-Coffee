import { Link } from "react-router-dom";
import bannerImage from "../../Images/image7.png";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-transparent py-20 md:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_18%_22%,rgba(196,158,118,0.22),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(143,91,54,0.16),transparent_24%)]" />
      <div className="container relative z-10">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-slideInLeft">
            <p className="mb-5 text-xs uppercase tracking-[0.32em] text-coffee-500">
              Mountain-grown in Mindanao
            </p>
            <h1 className="mb-5 font-['Cormorant_Garamond'] text-[clamp(3.2rem,6vw,6.1rem)] font-semibold leading-[0.92] text-coffee-900 animate-fade-in">
              Experience
              <br />
              peak flavor.
            </h1>
            <p className="mb-5 max-w-lg text-lg text-coffee-700 animate-fade-in-up">
              Handpicked. Perfectly roasted. Delivered with the quiet confidence
              of a premium daily ritual.
            </p>
            <p className="mb-12 max-w-xl text-base leading-relaxed text-coffee-800 animate-fade-in-up">
              Premium 100% Arabica coffee from Mt. Apo, Davao – sourced,
              roasted, and shipped with care while keeping the craft visible in
              every detail.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/menu"
                className="btn btn-lg"
              >
                Explore Menu
              </Link>
              <button className="btn btn-secondary btn-lg">
                Discover Origin
              </button>
            </div>
          </div>

          <div className="animate-slideInRight relative flex items-center justify-center">
            <div className="absolute inset-x-12 inset-y-10 rounded-[36px] border border-white/50 bg-white/35 blur-xl" />
            <div className="relative flex h-[28rem] w-full items-center justify-center overflow-hidden rounded-[40px] border border-[rgba(143,91,54,0.14)] bg-[linear-gradient(145deg,rgba(255,255,255,0.72),rgba(245,241,224,0.9))] p-8 shadow-[0_30px_80px_rgba(61,31,10,0.14)]">
              <img
                src={bannerImage}
                alt="Mt. Apo's Best Coffee"
                className="h-full w-full object-contain drop-shadow-[0_30px_30px_rgba(61,31,10,0.18)]"
              />
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-8 border-t border-[rgba(143,91,54,0.16)] pt-10">
          <div className="text-center">
            <p className="font-['Cormorant_Garamond'] text-4xl font-semibold text-coffee-900 mb-2">100%</p>
            <p className="text-sm uppercase tracking-[0.18em] text-coffee-700">Pure Arabica</p>
          </div>
          <div className="text-center">
            <p className="font-['Cormorant_Garamond'] text-4xl font-semibold text-coffee-900 mb-2">Fast</p>
            <p className="text-sm uppercase tracking-[0.18em] text-coffee-700">Free Delivery</p>
          </div>
          <div className="text-center">
            <p className="font-['Cormorant_Garamond'] text-4xl font-semibold text-coffee-900 mb-2">Fresh</p>
            <p className="text-sm uppercase tracking-[0.18em] text-coffee-700">Roasted Daily</p>
          </div>
        </div>
      </div>
    </section>
  );
}
