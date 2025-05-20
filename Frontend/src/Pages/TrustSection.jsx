import React from "react";
import { ShieldCheck, Users, Clock,LockKeyhole } from "lucide-react"; // Optional: lucide-react for icons

const TrustSection = () => {
  return (
    <div>
         {/* Trusted Section */}
         <section className="bg-black text-white pt-3 py-20 px-6 sm:px-10 lg:px-20">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-playfair font-semibold">
            🔐 Trusted. Secure. Transparent.
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg secoundry">
            BitReclaim uses real-time blockchain data — no middlemen, no risks.
            Your searches are private and never saved.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
            <div className="flex items-start gap-4">
              <ShieldCheck className="text-amber-400 w-8 h-8 mt-1" />
              <div>
                <h3 className="text-lg font-playfair">Non-custodial</h3>
                <p className="text-gray-400 text-sm leading-relaxed secoundry">
                  You stay in control — we never hold your keys or funds.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Users className="text-amber-400 w-8 h-8 mt-1" />
              <div>
                <h3 className="text-lg font-playfair">Open-source powered</h3>
                <p className="text-gray-400 text-sm leading-relaxed secoundry">
                  Built with transparency and trust using open technologies.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <LockKeyhole  className="text-amber-400 w-8 h-8 mt-1" />
              <div>
                <h3 className="text-lg font-playfair">Secure by design</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Globally distributed infrastructure ensures your access is
                  always on.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrustSection;
