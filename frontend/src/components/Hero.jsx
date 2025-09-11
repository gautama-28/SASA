import React from 'react';
import {
  FiShield,
  FiFilePlus,
  FiTrendingUp,
  FiCheckCircle,
  FiMapPin,
} from 'react-icons/fi';

function Hero() {
  return (
    <section className="w-full bg-gradient-to-b from-[#FFFFFF] to-[#E5DCDA]">
      {/* Banner */}
      <div className="relative w-full p-2">
        <img
          src="./HeroImage.png"
          alt="Hero Banner"
          className="w-auto object-cover  rounded-xl"
        />
       
      </div>

      {/* Info Section */}
      <div className="relative z-10">
        <div className="mx-auto max-w-8xl h-320 ">
          {/* About Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className=" px-28 py-20">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF3FF] ring-1 ring-[#dfe8fa]">
                <FiShield className="h-4 w-4 text-[#124072]" />
                <span className="text-xs font-medium tracking-wide text-[#124072]">
                  Citizen-first, transparent always
                </span>
              </div>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold font-ubuntu text-[#123A6E] tracking-tight">
                About Nagar Seva
              </h2>
              <p className="mt-3 text-base md:text-lg font-lato text-gray-700 leading-relaxed">
                Nagar Seva is a modern civic platform that connects citizens with
                their local authorities. Report issues like potholes, streetlights,
                garbage, or waterlogging in minutes and track the resolution journey
                — transparent and accountable.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Card 1 */}
                <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
                  <div className="mt-1 rounded-lg bg-[#E8F0FE] p-2 text-[#124072]">
                    <FiFilePlus className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-ubuntu font-semibold text-[#123A6E]">
                      Simple Reporting
                    </h4>
                    <p className="text-sm font-lato text-slate-600">
                      Capture, describe & submit in seconds.
                    </p>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
                  <div className="mt-1 rounded-lg bg-[#E8F0FE] p-2 text-[#124072]">
                    <FiTrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-ubuntu font-semibold text-[#123A6E]">
                      Transparent Tracking
                    </h4>
                    <p className="text-sm font-lato text-slate-600">
                      Real-time updates and milestones.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone Mockup */}
            <div className="flex justify-center ">
              <div className="relative absolute right-0 bottom-10 ">
                <img
                  src="/Mock Up.png"
                  alt="Nagar Seva App Mockup"
                  className="w-full h-full object-cover"
                />               
              </div>
            </div>
          </div>

          {/* Citizen Journey */}
          <div className="relative z-10 bottom-80 space-y-8 px-28">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF3FF] px-3 py-1 ring-1 ring-[#dfe8fa]">
              <span className="h-2 w-2 rounded-full bg-[#124072] animate-pulse" />
              <span className="text-xs tracking-wide font-ubuntu text-[#124072]">
                See it in action
              </span>
            </div>
            <h2 className="text-3xl font-bold font-ubuntu text-[#123A6E] tracking-tight">
              Citizen Journey on Mobile
            </h2>
            <p className="text-base font-lato text-slate-600 max-w-2xl">
              From reporting to resolution — a human-centered flow designed for
              speed and transparency. Below are real mockups from the app.
            </p>

            {/* Steps in mockups */}
            <div className="m-6 gap-6 md:grid md:grid-cols-4 md:gap-6 justify-center ">
              {[
                {
                  img: "/Splash Screen.png",
                  step: "Step 1 — Launch",
                  desc: "Clean start with government branding.",
                },
                {
                  img: "/Home Screen.png",
                  step: "Step 2 — Dashboard",
                  desc: "Quick access to report & track.",
                },
                {
                  img: "/Report Screen.png",
                  step: "Step 3 — Report",
                  desc: "Upload photo, describe, submit instantly.",
                },
                {
                  img: "/Complaint Description.png",
                  step: "Step 4 — Follow-up",
                  desc: "Track, upvote & resolve seamlessly.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className=" w-64 md:w-auto p-4"
                >
                  {/* Phone Frame */}
                    <img
                      src={item.img}
                      alt={item.step}
                      className="w-40 h-auto hover:-translate-y-4 transition-all rounded-6xl"
                    />                 

                  <div className="mt-3">
                    <h4 className="font-ubuntu font-semibold text-[#123A6E]">
                      {item.step}
                    </h4>
                    <p className="text-sm font-lato text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
