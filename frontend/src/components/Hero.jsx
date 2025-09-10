
import React from 'react';

function Hero() {
  return (
    <section className="w-full">
      <img src="/HeroImage.png" alt="Hero Banner" className="w-auto h-auto" />
      {/* Info Section */}
      <div className="bg-white py-8 px-6 md:px-16">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-bold mb-2 font-ubuntu text-[#124072]">About Nagar Seva</h3>
          <p className="text-base mb-6 font-lato text-gray-700">Nagar Seva is a digital platform designed to connect citizens directly with their local authorities. Through a simple mobile-first app, people can report everyday civic problems such as potholes, broken streetlights, garbage collection, or waterlogging. The system ensures transparent tracking, faster resolution, and active community participation.</p>
          <h3 className="text-lg font-bold mb-2 font-ubuntu text-[#124072]">How It Works</h3>
          <p className="text-base mb-6 font-lato text-gray-700">Report – Capture a photo, add a short description, and submit the complaint with location.<br/>Track – Monitor the status of your complaint in real-time.<br/>Resolve – Get notified once the issue is addressed by the responsible department.</p>
          <h3 className="text-lg font-bold mb-2 font-ubuntu text-[#124072]">Citizen Benefits</h3>
          <ul className="list-disc pl-5 text-base font-lato text-gray-700">
            <li>Submit complaints without visiting offices</li>
            <li>Get transparent updates on every complaint</li>
            <li>Leverage community power through upvotes</li>
            <li>Experience faster and more accountable governance</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Hero;