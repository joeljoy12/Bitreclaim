import React from "react";

const steps = [
  {
    title: "Enter Your Bitcoin Address",
    description: "We scan the blockchain for unclaimed UTXOs tied to your public address using our secure node network.",
    icon: "🔍",
  },
  {
    title: "Scan & Match",
    description: "BitReclaim analyzes transaction histories and filters eligible outputs that are recoverable.",
    icon: "⚙️",
  },
  {
    title: "Claim & Reclaim",
    description: "If unclaimed Bitcoin is found, we guide you step-by-step to initiate a secure reclaim process.",
    icon: "💰",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative z-10 bg-black text-white px-6 sm:px-10 lg:px-20 py-24 overflow-hidden">
      {/* Aurora Background */}
    

      <div className="max-w-6xl mx-auto text-center space-y-12 relative z-10">
        {/* Section Heading */}
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-playfair">
            <span className="bg-gradient-to-r from-white to-gray-200 text-transparent bg-clip-text">
              How It
            </span>{" "}
            <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-700 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            BitReclaim makes reclaiming lost Bitcoin simple, transparent, and secure — even if you’re not technical.
          </p>
        </div>

        <div className=""/>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-10 mt-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-amber-500/5  hover:border  border-amber-500 rounded-2xl p-6 text-left backdrop-blur-md hover:shadow-2xl transition-transform duration-300 active:-translate-y-1 cursor-pointer shadow-sm shadow-amber-500/40 inset-shadow-sm inset-shadow-amber-500/100"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
              <p className="text-white/80 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
