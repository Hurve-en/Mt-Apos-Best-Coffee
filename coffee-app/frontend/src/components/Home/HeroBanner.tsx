import { Link } from "react-router-dom";
import bannerImage from "../../Images/image7.png";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 lg:py-40 bg-coffee-50">
      {/* Decorative elements removed */}

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="animate-slideInLeft">
            <h1 className="mb-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase leading-tight text-coffee-900 animate-fade-in">
              Experience Peak Flavor
            </h1>
            <p className="text-lg text-coffee-700 mb-6 max-w-lg animate-fade-in-up">
              Handpicked. Perfectly Roasted. Delivered Fast.
            </p>
            <p className="text-base text-coffee-800 mb-12 leading-relaxed max-w-xl animate-fade-in-up">
              Premium 100% Arabica coffee from Mt. Apo, Davao – sourced,
              roasted, shipped with care.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/menu"
                className="btn btn-lg bg-coffee-500 text-pure-white hover:bg-coffee-600 shadow-md transition-transform transform hover:-translate-y-1"
              >
                Order Now
              </Link>
              <button className="btn btn-lg border-2 border-coffee-500 text-coffee-500 hover:bg-coffee-50">
                Learn More
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="animate-slideInRight relative flex justify-center items-center">
            <div className="relative w-full h-96 flex items-center justify-center">
              {/* Product image */}
              <img
                src={bannerImage}
                alt="Mt. Apo's Best Coffee"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-gray-300/30">
          <div className="text-center">
            <p className="text-3xl font-bold text-coffee-900 mb-2">100%</p>
            <p className="text-coffee-700">Pure Arabica</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-coffee-900 mb-2">Fast</p>
            <p className="text-coffee-700">Free Delivery</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-coffee-900 mb-2">Fresh</p>
            <p className="text-coffee-700">Roasted Daily</p>
          </div>
        </div>
      </div>
    </section>
  );
}
