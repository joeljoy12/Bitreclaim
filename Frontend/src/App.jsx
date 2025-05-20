
import Cta from "./Pages/Cta";
import Footer from "./Pages/Footer";
import Hero from "./Pages/Hero";
import HowItWorks from "./Pages/How_it_Works";
import Navbar from "./Pages/Navbar";
import TestimonialsSection from "./Pages/TestimonialsSection";
import TrustSection from "./Pages/TrustSection";
import UTXOSearchSection from "./Pages/UTXOSearchSection";




function App() {
  return (
    <div>
      
      <Navbar/>
      <Hero/>
      <TrustSection/>
      <HowItWorks />
      <Cta />
      <UTXOSearchSection />
  <Footer />

    </div>
  );
}

export default App;
