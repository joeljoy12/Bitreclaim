import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Users, Clock } from "lucide-react"; // ✅ Import icons

const Hero = () => {
  return (
    <>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-black text-white min-h-screen px-6 sm:px-10 lg:px-20 py-24 flex flex-col lg:flex-row items-center justify-between gap-10"
        aria-labelledby="hero-title"
        role="region"
      >
        {/* Aurora Glow */}
        <div className="absolute top-[200px] left-[1200px] w-[2500px] h-[300px] bg-gradient-to-br from-amber-500 to-black rounded-full blur-[180px] opacity-40 z-0 animate-pulse pointer-events-none" />

        {/* Text Content */}
        <motion.div
          className="relative max-w-2xl space-y-6 z-10"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-amber-400 text-sm uppercase tracking-widest">
            The Next Phase
          </h2>
          <h1
  id="hero-title"
  className="font-playfair text-4xl lg:text-5xl font-extrabold leading-snug tracking-tight"
>

  <span className="bg-gradient-to-r from-gray-400 via-gray-200 to-white bg-clip-text text-transparent">
    Reclaim Your
  </span>{" "}
  <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
    Lost Bitcoin
  </span>
</h1>


          <p className="text-gray-400  leading-relaxed text-2xl">
            Trace and recover your unspent Bitcoin from the blockchain —
            securely and effortlessly.
          </p>

          <div className="flex gap-4">
            <button
              type="button"
              className="bg-amber-400 text-black px-6 py-3 rounded-md text-sm font-bold shadow-md hover:brightness-110 transition"
            >
              Reclaim Now
            </button>
            <button
              type="button"
              className="border border-gray-500 text-white px-6 py-3 rounded-md text-sm font-bold hover:bg-gray-800 transition"
            >
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Optional Image */}
        <motion.div
          className="z-10 max-w-md w-full"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src="/images/bitcoin-dashboard-mockup.png"
            alt="Bitcoin Recovery UI"
            className="w-full rounded-lg shadow-lg border border-gray-700"
          />
        </motion.div>
      </section>

   
    </>
  );
};

export default Hero;
