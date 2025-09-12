import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const dropdownRefs = useRef({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openMenu &&
        dropdownRefs.current[openMenu] &&
        !dropdownRefs.current[openMenu].contains(e.target)
      ) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const navItems = [
    {
      label: "Municipality",
      department: "municipality", 
      submenu: [
        { label: "Commissioner Login", to: "/login?dept=municipality&role=commissioner" },
        { label: "Executive Officer Login", to: "/login?dept=municipality&role=executive_officer" },
        { label: "Ward Inspector Login", to: "/login?dept=municipality&role=ward_inspector" },
      ],
    },
    {
      label: "Electricity Department",
      department: "electricity_department",
      submenu: [
        { label: "Chief Engineer Login", to: "/login?dept=electricity_department&role=chief_engineer" },
        { label: "Executive Engineer Login", to: "/login?dept=electricity_department&role=executive_engineer" },
        { label: "Junior Engineer Login", to: "/login?dept=electricity_department&role=junior_engineer" },
      ],
    },
    {
      label: "Development Authority", 
      department: "development_authority",
      submenu: [
        { label: "Vice Chairman Login", to: "/login?dept=development_authority&role=vice_chairman" },
        { label: "Planning Officer Login", to: "/login?dept=development_authority&role=planning_officer" },
        { label: "Site Inspector Login", to: "/login?dept=development_authority&role=site_inspector" },
      ],
    },
  ];

  return (
    <div className="relative w-full font-ubuntu">
      {/* Gradient Bar */}
      <div
        className="relative w-full h-24 flex items-center"
        style={{
          background:
            "linear-gradient(100deg, #fdd18fff 0%, #FFF 50%, #aae3acff 100%)",
        }}
      >
        {/* Background image */}
        <img
          src="/fadedbg.svg"
          alt="Faded Background"
          className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[28rem] h-auto object-contain pointer-events-none select-none opacity-60"
          style={{ zIndex: 0 }}
        />

        {/* Left Logo */}
        <div className="flex items-center z-10">
          <img
            src="/WebsiteLogo.png"
            alt="Nagar Seva Logo"
            className="h-14 w-auto ml-10"
          />
        </div>

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
          <img
            src="/digi.svg"
            alt="Digital India Logo"
            className="h-10 w-auto"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="w-full bg-[#124072] h-10 flex items-center text-white font-ubuntu text-sm font-medium px-16 relative z-20">
        <ul className="flex items-center w-full">
          {/* Home */}
          <li className="hover:text-[#FFA726] cursor-pointer">
            <Link to="/">Home</Link>
          </li>
          <img src="/whiteline.svg" alt="|" className="mx-5 h-5 w-auto" />

          {/* Dropdown Menus */}
          {navItems.map((item, index) => (
            <React.Fragment key={item.label}>
              <li
                className="relative group cursor-pointer flex items-center hover:text-[#FFA726]"
                onClick={() => toggleMenu(item.label)}
                ref={(el) => (dropdownRefs.current[item.label] = el)}
              >
                {item.label}
                <img src="/dropdown.svg" alt="▼" className="ml-2 h-2 w-2" />

                {/* Dropdown */}
                <ul
                  className={`absolute left-0 top-full mt-2 min-w-[180px] bg-white shadow-lg rounded-md py-2 transform transition-all duration-200 ${
                    openMenu === item.label
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  } group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto`}
                >
                  {item.submenu.map((sub, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 text-[#124072] cursor-pointer 
                                 hover:bg-[#f5f5f5] hover:text-[#F57C00] 
                                 transition-colors duration-200 rounded-md"
                    >
                      {sub.to ? (
                        <Link to={sub.to} className="block w-full h-full">
                          {sub.label}
                        </Link>
                      ) : (
                        sub.label
                      )}
                    </li>
                  ))}
                </ul>
              </li>

              {index < navItems.length && (
                <img src="/whiteline.svg" alt="|" className="mx-5 h-5 w-auto" />
              )}
            </React.Fragment>
          ))}

          {/* Help */}
          <li className="hover:text-[#FFA726] cursor-pointer">Help</li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
