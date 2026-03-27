export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Hurveen Veloso",
      rating: 5,
      text: "The best coffee I've had in Cebu! Fast delivery and premium quality. Highly recommend!",
      avatar: "HV",
    },
    {
      id: 2,
      name: "Keziah Sasing",
      rating: 5,
      text: "Perfect roast level, smooth flavor. I've been a customer for months now.",
      avatar: "KS",
    },
    {
      id: 3,
      name: "Rheynel Generalao",
      rating: 4,
      text: "Great coffee and excellent customer service. Worth every peso!",
      avatar: "RG",
    },
    {
      id: 4,
      name: "Kendall Maputi",
      rating: 5,
      text: "Finally found quality coffee in Cebu. Mt. Apo's Best is now my daily brew.",
      avatar: "KM",
    },
    {
      id: 5,
      name: "AJ Mozart",
      rating: 5,
      text: "Customizable options are amazing. I can choose exactly what I want!",
      avatar: "AM",
    },
  ];

  const renderStars = (rating: number) => {
    return "⭐".repeat(rating);
  };

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {testimonials.map((testimonial) => (
        <div
          key={testimonial.id}
          className="card animate-fadeInUp rounded-[28px] border border-[rgba(143,91,54,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,249,245,0.94))] p-7"
        >
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-coffee-700 to-coffee-900 text-sm font-bold text-white">
              {testimonial.avatar}
            </div>
            <div>
              <h4 className="font-semibold text-black">{testimonial.name}</h4>
              <p className="text-xs uppercase tracking-[0.16em] text-coffee-700">
                {renderStars(testimonial.rating)}
              </p>
            </div>
          </div>

          <p className="font-['Cormorant_Garamond'] text-[1.65rem] italic leading-snug text-coffee-900">
            &quot;{testimonial.text}&quot;
          </p>
        </div>
      ))}
    </div>
  );
}
