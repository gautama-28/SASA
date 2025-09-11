



import React from 'react';

function Footer() {
  return (
    <footer className="bg-[#0D3157] font-lato pt-12 pb-6 px-6 md:px-24 lg:px-32">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-12 md:gap-0">
        {/* Text columns on the left */}
        <div className="flex flex-row gap-16 w-full justify-start">
          <div>
            <h4 className="font-bold mb-2 text-lg text-white">Platfrom</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="text-white/60 hover:text-[#FFA726] text-base font-normal transition">About US</a></li>
              <li><a href="#how" className="text-white/60 hover:text-[#FFA726] text-base font-normal transition">How it Works</a></li>
              <li><a href="#benefits" className="text-white/60 hover:text-[#FFA726] text-base font-normal transition">Citizen Benifits</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2 text-lg text-white">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#help" className="text-white/60 hover:text-[#FFA726] text-base font-normal transition">Help &amp; support</a></li>
              <li><a href="#contact" className="text-white/60 hover:text-[#FFA726] text-base font-normal transition">Contact Us</a></li>
              <li><a href="#terms" className="text-white/60 hover:text-[#FFA726] text-base font-normal transition">Terms of use</a></li>
              <li><a href="#privacy" className="text-white/60 hover:text-[#FFA726] text-base font-normal transition">Privacy policy</a></li>
            </ul>
          </div>
        </div>
        {/* Logo on the right */}
        <div className="flex-shrink-0 flex flex-col items-end ml-12">
          <img src="/footerbg.svg" alt="Nagar Seva Logo" className="h-16 w-auto mb-2" />
        </div>
      </div>
      {/* Divider */}
      <div className="border-t border-white/20 my-8 max-w-7xl mx-auto" />
      {/* Bottom Text */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-white/70 px-2">
        <span>© 2025 Nagar Seva. All rights reserved.</span>
        <span className="mt-2 md:mt-0">All trademarks are the property of their respective owners.</span>
      </div>
    </footer>
  );
}

export default Footer;