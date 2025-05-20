import React from 'react'

const TestimonialsSection = () => {
  return (
    <div>
        <section className="bg-[#121212] text-white px-6 py-20 lg:px-20">
  <div className="max-w-5xl mx-auto text-center space-y-10">
    <h2 className="text-3xl font-bold">What Our Users Say</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Testimonial 1 */}
      <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-md">
        <p className="text-gray-300 italic">"I recovered 0.42 BTC I didn’t even know I had. BitReclaim is a game changer!"</p>
        <p className="mt-4 font-semibold text-amber-400">— Satoshi L., Tokyo</p>
      </div>

      {/* Testimonial 2 */}
      <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-md">
        <p className="text-gray-300 italic">"Fast, trustworthy, and simple. I recommend it to every HODLer."</p>
        <p className="mt-4 font-semibold text-amber-400">— Alice B., Berlin</p>
      </div>
    </div>
  </div>
</section>
    </div>
  )
}

export default TestimonialsSection