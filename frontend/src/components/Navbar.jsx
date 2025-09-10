
import React from 'react';

function Navbar() {
  return (
    <div className="relative w-full font-ubuntu">
      {/* Gradient Bar with faded background image */}
      <div className="relative w-full h-25 flex items-center"  style={{background: 'linear-gradient(180deg, #fdd18fff 0%, #FFF 50%, #aae3acff 100%)'}}>
        {/* Faded background image center */}
        <img src="/fadedbg.svg" alt="Faded Background" className="absolute left-1/2 bottom-0 left-1/2 -translate-x-1/2 w-100 h-auto object-contain pointer-events-none select-none opacity-60" style={{zIndex: 0}} />
        {/* Left Logo and Title */}
        <div className="flex items-center z-10 ">
          <img src="/WebsiteLogo.png" alt="Nagar Seva Logo" className="h-14 w-auto ml-10" />          
        </div>
        {/* Center Spacer */}
        <div className="flex-1" />
        {/* Hindi Switch */}
        <div className="flex items-center gap-2 z-10 mr-10">
          <span className="bg-white rounded-lg px-2 py-1 shadow text-[#F57C00] font-bold text-sm flex items-center">
            <span className="mr-1">अ</span>
            <span className="text-[#F57C00]">हिंदी संस्करण</span>
          </span>
        </div>
        {/* Digital India Logo */}
        <div className="z-10 mr-10">
          <img src="/digi.svg" alt="Digital India Logo" className="h-10 w-auto mr-6" />          
        </div>
      </div>
      {/* Navigation Bar */}
      <nav className="w-full bg-[#124072] h-10 flex items-center text-white font-ubuntu text-sm font-medium px-16" style={{zIndex: 20}}>
        <ul className="flex items-center w-full">
          <li className="hover:text-[#FFA726] cursor-pointer">Home</li>
          <img src="/whiteline.svg" alt="Separator" className="mx-5 h-5 w-auto select-none pointer-events-none" />
          <li className="relative group cursor-pointer flex items-center hover:text-[#FFA726]">
            Municipality
            <img src="/dropdown.svg" alt="Dropdown" className="ml-2 h-2 w-2" />
          </li>
          <img src="/whiteline.svg" alt="Separator" className="mx-5 h-5 w-auto select-none pointer-events-none" />
          <li className="relative group cursor-pointer flex items-center hover:text-[#FFA726]">
            Electricity Department
            <img src="/dropdown.svg" alt="Dropdown" className="ml-2 h-2 w-2" />
          </li>
          <img src="/whiteline.svg" alt="Separator" className="mx-5 h-5 w-auto select-none pointer-events-none" />
          <li className="relative group cursor-pointer flex items-center hover:text-[#FFA726]">
            Development Authority
            <img src="/dropdown.svg" alt="Dropdown" className="ml-2 h-2 w-2" />
          </li>
          <img src="/whiteline.svg" alt="Separator" className="mx-5 h-5 w-auto select-none pointer-events-none" />
          <li className="hover:text-[#FFA726] cursor-pointer">Help</li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;