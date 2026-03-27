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
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {reasons.map((reason, index) => (
        <div
          key={reason.id}
          className="group rounded-[28px] border border-[rgba(143,91,54,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,249,245,0.92))] p-7 text-left shadow-[0_18px_45px_rgba(61,31,10,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(61,31,10,0.12)]"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(143,91,54,0.12)] bg-coffee-50 transition-colors duration-300 group-hover:bg-white">
            {reason.icon}
          </div>
          <p className="mb-2 text-[0.68rem] uppercase tracking-[0.18em] text-coffee-500">
            Why it matters
          </p>
          <h3 className="mb-2 text-[2rem] font-semibold leading-none text-black">
            {reason.title}
          </h3>
          <p className="text-sm leading-relaxed text-coffee-700">{reason.description}</p>
        </div>
      ))}
    </div>
  );
}
