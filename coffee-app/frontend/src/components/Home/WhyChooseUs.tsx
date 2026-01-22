export default function WhyChooseUs() {
  const reasons = [
    {
      id: 1,
      title: "Fast Delivery",
      description: "Get coffee delivered in minutes across Cebu",
      icon: "⚡",
    },
    {
      id: 2,
      title: "Premium Quality",
      description: "100% Arabica beans from Mt. Apo",
      icon: "🌿",
    },
    {
      id: 3,
      title: "Customizable",
      description: "Choose your roast level and grind",
      icon: "⚙️",
    },
    {
      id: 4,
      title: "Cebu Wide",
      description: "Serving all of Cebu with premium coffee",
      icon: "📍",
    },
  ];

  return (
    <div className="grid-4">
      {reasons.map((reason) => (
        <div
          key={reason.id}
          className="card text-center hover:border-b-4 hover:border-caramel transition-all duration-300"
        >
          <div className="text-5xl mb-4">{reason.icon}</div>
          <h3 className="text-brown font-semibold mb-3">{reason.title}</h3>
          <p className="text-muted text-sm leading-relaxed">
            {reason.description}
          </p>
        </div>
      ))}
    </div>
  );
}
