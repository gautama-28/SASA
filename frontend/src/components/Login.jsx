import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import userCredentials from "../data/userCredentials.json";
import districts from "../data/districts.json";
import CustomDropdown from "./CustomDropdown";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill form based on URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const deptParam = searchParams.get('dept');
    const roleParam = searchParams.get('role');
    
    if (deptParam && roleParam) {
      setSelectedDepartment(deptParam);
      setSelectedRole(roleParam);
    }
  }, [location.search]);

  // Get available departments
  const departments = Object.keys(userCredentials).map(key => ({
    value: key,
    label: userCredentials[key].department
  }));

  // Get available roles based on selected department
  const getRoles = () => {
    if (!selectedDepartment) return [];
    return Object.keys(userCredentials[selectedDepartment].roles).map(key => ({
      value: key,
      label: userCredentials[selectedDepartment].roles[key].title
    }));
  };

  // Get district options
  const districtOptions = districts.districts.map(district => ({
    value: district.id,
    label: district.name
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!selectedDistrict || !selectedDepartment || !selectedRole || !userId || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Check credentials
    const departmentData = userCredentials[selectedDepartment];
    const roleData = departmentData?.roles[selectedRole];
    const districtCredentials = roleData?.credentials[selectedDistrict];

    if (districtCredentials && 
        districtCredentials.userId === userId && 
        districtCredentials.password === password) {
      
      // Store login info in localStorage
      localStorage.setItem("userSession", JSON.stringify({
        district: selectedDistrict,
        department: selectedDepartment,
        role: selectedRole,
        userName: districtCredentials.name,
        isLoggedIn: true
      }));

      // Navigate to admin page
      navigate("/admin");
    } else {
      setError("Invalid credentials. Please check your User ID and Password.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
      style={{
        backgroundImage: `url('/LoginBg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md flex flex-col items-center">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          {/* Inline shield avatar to avoid external asset dependency */}
          <span className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#0D3157] text-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
              <path d="M12 2l7 3v6c0 5.25-3.438 9.75-7 11-3.562-1.25-7-5.75-7-11V5l7-3z"/>
            </svg>
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
            {selectedRole && selectedDepartment ? 
              `${userCredentials[selectedDepartment]?.roles[selectedRole]?.title} Login` : 
              "NagarSeva Login"
            }
          </h2>
        </div>

        {/* Form */}
        <form className="w-full" onSubmit={handleSubmit} noValidate>
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* District Dropdown */}
          <CustomDropdown
            options={districtOptions}
            value={selectedDistrict}
            onChange={setSelectedDistrict}
            placeholder="Select District"
            label="District"
            className="mb-4"
          />

          {/* Department Dropdown */}
          <CustomDropdown
            options={departments}
            value={selectedDepartment}
            onChange={(value) => {
              setSelectedDepartment(value);
              setSelectedRole(""); // Reset role when department changes
            }}
            placeholder="Select Department"
            label="Department"
            className="mb-4"
          />

          {/* Role Dropdown */}
          <CustomDropdown
            options={getRoles()}
            value={selectedRole}
            onChange={setSelectedRole}
            placeholder="Select Role"
            label="Role"
            disabled={!selectedDepartment}
            className="mb-4"
          />

          {/* User ID */}
          <div className="relative mb-4">
            <input
              id="userId"
              name="userId"
              type="text"
              placeholder=" "
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              autoComplete="off"
              className="peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-3 pt-5 pb-2 text-sm text-gray-900 focus:border-[#0D3157] focus:ring-2 focus:ring-[#0D3157]/20 focus:outline-none transition"
              aria-label="User ID"
            />
            <label
              htmlFor="userId"
              className="pointer-events-none absolute left-3 -top-2 z-[1] bg-white px-1 text-xs text-gray-600 transition-all duration-150 transform origin-left
                         peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
                         peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#0D3157] peer-focus:scale-75
                         peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-[#0D3157] peer-[&:not(:placeholder-shown)]:scale-75"
            >
              User ID
            </label>
          </div>

          {/* Password */}
          <div className="relative mb-1">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              className="peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-3 pt-5 pb-2 text-sm text-gray-900 focus:border-[#0D3157] focus:ring-2 focus:ring-[#0D3157]/20 focus:outline-none transition pr-10"
              aria-label="Password"
            />
            <label
              htmlFor="password"
              className="pointer-events-none absolute left-3 -top-2 z-[1] bg-white px-2 text-xs text-gray-600 transition-all duration-150 transform origin-left
                         peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
                         peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#0D3157] peer-focus:scale-75
                         peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-[#0D3157] peer-[&:not(:placeholder-shown)]:scale-75"
            >
              Password
            </label>

            {/* Toggle Button (accessible) */}
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-pressed={showPassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center rounded p-1 text-gray-500 hover:text-gray-700"
            >
              {/* Use /visible.png for show; inline eye-off for hide */}
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58A3 3 0 0012 15a3 3 0 002.42-4.42M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7c-2.24 0-4.2-.78-5.8-1.86" />
                </svg>
              ) : (
                <img src="/visible.png" alt="Show password" className="h-5 w-5 opacity-80" />
              )}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!selectedDistrict || !selectedDepartment || !selectedRole || !userId || !password}
            className="w-full bg-[#0D3157] text-white text-sm font-semibold py-3 rounded-md mt-4 hover:bg-[#124072] shadow-md transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            LOGIN
          </button>
        </form>

        {/* Footer Help */}
        <div className="mt-5 text-center text-xs text-gray-500">
          <p>Forgot your password?</p>
          <p className="mt-1 font-medium text-gray-700">
            Need help? Contact your system administrator
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default Login;
