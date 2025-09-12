import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Analytics from './Analytics'
import Issues from './Issues'
import userCredentials from '../data/userCredentials.json'
import districts from '../data/districts.json'

function Admin() {
  const navigate = useNavigate()
  const [userSession, setUserSession] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const session = localStorage.getItem("userSession")
    if (!session) {
      navigate("/login")
      return
    }

    try {
      const parsedSession = JSON.parse(session)
      if (!parsedSession.isLoggedIn) {
        navigate("/login")
        return
      }
      setUserSession(parsedSession)
    } catch (error) {
      console.error("Error parsing user session:", error)
      navigate("/login")
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("userSession")
    navigate("/")
  }

  const getDistrictName = (districtId) => {
    const district = districts.districts.find(d => d.id === districtId)
    return district ? district.name : districtId
  }

  const getDepartmentName = (departmentId) => {
    return userCredentials[departmentId]?.department || departmentId
  }

  const getRoleName = (departmentId, roleId) => {
    return userCredentials[departmentId]?.roles[roleId]?.title || roleId
  }

  if (!userSession) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="pb-16 min-h-screen">
      {/* Admin Header */}
      <div className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 mb-1">
              Welcome, {userSession.userName}
            </h1>
            <p className="text-gray-600 text-sm">
              {getRoleName(userSession.department, userSession.role)} | {getDistrictName(userSession.district)} District
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      <Analytics />
      <Issues />
    </div>
  )
}

export default Admin