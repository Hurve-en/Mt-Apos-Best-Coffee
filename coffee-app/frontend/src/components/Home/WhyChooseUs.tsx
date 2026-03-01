import type { JSX } from "react";

type Reason = {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
};

const iconClass = "w-6 h-6 text-coffee-900";

export default function WhyChooseUs() {
  const reasons: Reason[] = [
    {
      id: 1,
      title: "Fast Delivery",
      description: "Get coffee delivered in minutes across Cebu",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass} stroke="currentColor" strokeWidth="1.8">
          <path d="M3 12h10" strokeLinecap="round" />
          <path d="M13 8h4l3 3v5h-2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Premium Quality",
      description: "100% Arabica beans from Mt. Apo",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass} stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3l2.4 1.3 2.7-.5.5 2.7 2 1.9-2 1.9-.5 2.7-2.7-.5L12 14l-2.4-1.3-2.7.5-.5-2.7-2-1.9 2-1.9.5-2.7 2.7.5L12 3z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 7.8l.95 1.92 2.12.3-1.54 1.5.36 2.11L12 12.6l-1.89 1 .36-2.11-1.54-1.5 2.12-.3L12 7.8z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Customizable",
      description: "Choose your roast level and grind",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass} stroke="currentColor" strokeWidth="1.8">
          <path d="M4 7h10" strokeLinecap="round" />
          <path d="M4 12h16" strokeLinecap="round" />
          <path d="M4 17h10" strokeLinecap="round" />
          <circle cx="16" cy="7" r="2" />
          <circle cx="8" cy="17" r="2" />
        </svg>
      ),
    },
    {
      id: 4,
      title: "Cebu Wide",
      description: "Serving all of Cebu with premium coffee",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass} stroke="currentColor" strokeWidth="1.8">
          <path d="M12 21s7-6.5 7-11a7 7 0 10-14 0c0 4.5 7 11 7 11z" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {reasons.map((reason, index) => (
        <div
          key={reason.id}
          className="group bg-white rounded-2xl border border-neutral-200 p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-coffee-50 border border-neutral-200 flex items-center justify-center group-hover:bg-white transition-colors duration-300">
            {reason.icon}
          </div>
          <h3 className="text-black font-semibold mb-2 text-lg">{reason.title}</h3>
          <p className="text-coffee-700 text-sm leading-relaxed">{reason.description}</p>
        </div>
      ))}
    </div>
  );
}
