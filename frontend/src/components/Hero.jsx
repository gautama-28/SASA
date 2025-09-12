import React from 'react'
import { FiShield, FiFilePlus, FiTrendingUp } from 'react-icons/fi'

function Hero() {
  return (
    <section className="relative w-full bg-gradient-to-b from-[#FFFFFF] to-[#E5DCDA]">
      {/* Background phone image at top-right (no right padding/margin) */}
      <div className="pointer-events-none absolute top-0 right-0 z-0 hidden md:block">
        <img
          src="/Mock Up.png"
          alt="Nagar Seva App Mockup"
          className="select-none w-[28rem] lg:w-[34rem] xl:w-[38rem] h-auto object-contain"
        />
      </div>
  <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16 py-8 md:py-14">
        {/* Top: About + Phone mockup */}
  <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2 md:gap-6 lg:gap-8">
    {/* Left: Text */}
    <div className="relative z-10 self-start">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF3FF] px-3 py-1 ring-1 ring-[#dfe8fa]">
              <FiShield className="h-4 w-4 text-[#124072]" />
              <span className="text-xs font-medium tracking-wide text-[#124072]">
                Citizen-first, transparent always
              </span>
            </div>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-[40px] font-bold font-ubuntu text-[#123A6E] tracking-tight">
              About Nagar Seva
            </h2>
            <p className="mt-3 text-base md:text-lg font-lato text-gray-700 leading-relaxed max-w-2xl">
              Nagar Seva is a modern civic platform that connects citizens with their local authorities. Report issues like potholes, streetlights, garbage, or waterlogging in minutes and track the resolution journey — transparent and accountable.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Card 1 */}
              <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="mt-1 rounded-lg bg-[#E8F0FE] p-2 text-[#124072]">
                  <FiFilePlus className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-ubuntu font-semibold text-[#123A6E]">Simple Reporting</h4>
                  <p className="text-sm font-lato text-slate-600">Capture, describe & submit in seconds.</p>
                </div>
              </div>
              {/* Card 2 */}
              <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="mt-1 rounded-lg bg-[#E8F0FE] p-2 text-[#124072]">
                  <FiTrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-ubuntu font-semibold text-[#123A6E]">Transparent Tracking</h4>
                  <p className="text-sm font-lato text-slate-600">Real-time updates and milestones.</p>
                </div>
              </div>
            </div>

            {/* See it in action pill moved to Citizen Journey section below */}
          </div>

          {/* Right column placeholder to preserve layout on md+ */}
          <div className="hidden md:block" aria-hidden="true" />
        </div>

        {/* Citizen Journey */}
        <div className="mt-16 md:mt-14 lg:mt-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF3FF] px-3 py-1 ring-1 ring-[#dfe8fa]">
            <span className="h-2 w-2 rounded-full bg-[#124072] animate-pulse" />
            <span className="text-xs tracking-wide font-ubuntu text-[#124072]">See it in action</span>
          </div>
          <h2 className="text-3xl font-bold font-ubuntu text-[#123A6E] tracking-tight">Citizen Journey on Mobile</h2>
          <p className="mt-3 max-w-3xl text-base font-lato text-slate-600">
            From reporting to resolution — a human-centered flow designed for speed and transparency. Below are real mockups from the app.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { img: '/Splash Screen.png', step: 'Step 1 — Launch', desc: 'Clean start with government branding.' },
              { img: '/Home Screen.png', step: 'Step 2 — Dashboard', desc: 'Quick access to report & track.' },
              { img: '/Report Screen.png', step: 'Step 3 — Report', desc: 'Upload photo, describe, submit instantly.' },
              { img: '/Complaint Description.png', step: 'Step 4 — Follow-up', desc: 'Track, upvote & resolve seamlessly.' },
            ].map((item, idx) => (
              <div key={idx} className="p-2">
                <img
                  src={item.img}
                  alt={item.step}
                  className="w-36 sm:w-40 md:w-44 h-auto transition-all duration-200 hover:-translate-y-2"
                />
                <div className="mt-3">
                  <h4 className="font-ubuntu font-semibold text-[#123A6E]">{item.step}</h4>
                  <p className="text-sm font-lato text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
