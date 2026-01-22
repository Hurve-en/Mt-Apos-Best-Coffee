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
    <div className="grid-4 lg:grid-5">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="card-cream card animate-fadeInUp">
          {/* Avatar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-caramel to-tertiary-brown flex items-center justify-center text-cream font-bold text-sm">
              {testimonial.avatar}
            </div>
            <div>
              <h4 className="font-semibold text-brown">{testimonial.name}</h4>
              <p className="text-xs text-muted">
                {renderStars(testimonial.rating)}
              </p>
            </div>
          </div>

          {/* Review Text */}
          <p className="text-muted text-sm italic">
            &quot;{testimonial.text}&quot;
          </p>
        </div>
      ))}
    </div>
  );
}
