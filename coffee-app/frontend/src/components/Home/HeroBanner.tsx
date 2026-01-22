import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/useRedux";

export default function HeroBanner() {
  const { isAuthenticated } = useAppSelector((state: any) => state.auth);

  return (
    <section className="relative overflow-hidden py-20 md:py-32 lg:py-40 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 opacity-5 text-9xl">☕</div>
      <div className="absolute bottom-10 left-10 opacity-5 text-9xl">☕</div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="animate-slideInLeft">
            <h1 className="mb-6">Experience Peak Flavor</h1>
            <p className="text-xl text-muted mb-8 leading-relaxed max-w-xl">
              Handpicked. Perfectly Roasted. Delivered Fast.
            </p>
            <p className="text-lg text-secondary-brown mb-12 leading-relaxed max-w-xl">
              Premium 100% Arabica coffee from Mt. Apo, Davao. Carefully sourced
              and roasted to perfection. Experience the true taste of Philippine
              coffee craftsmanship.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/menu" className="btn btn-primary btn-lg">
                Order Now
              </Link>
              <button className="btn btn-secondary btn-lg">Learn More</button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="animate-slideInRight relative flex justify-center items-center">
            <div className="relative w-full h-96 flex items-center justify-center">
              {/* Placeholder for product image - replace with actual image */}
              <div className="text-center">
                <div className="text-8xl mb-4 animate-float">☕</div>
                <p className="text-secondary-brown font-semibold">
                  Mt. Apo's Best
                </p>
                <p className="text-caramel text-sm">Premium Arabica Coffee</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-caramel/30">
          <div className="text-center">
            <p className="text-3xl font-bold text-caramel mb-2">100%</p>
            <p className="text-secondary-brown">Pure Arabica</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-caramel mb-2">Fast</p>
            <p className="text-secondary-brown">Free Delivery</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-caramel mb-2">Fresh</p>
            <p className="text-secondary-brown">Roasted Daily</p>
          </div>
        </div>
      </div>
    </section>
  );
}
