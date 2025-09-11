import React from 'react'
import Analytics from './Analytics'
import Issues from './Issues'
import IssuesMap from './IssuesMap'

function Admin() {
return (

    <div className="bg-gradient-to-b from-[#FFFFFF] to-[#E5DCDA] pb-16 min-h-screen">
        <Analytics />
        <Issues />
         <div className="flex items-center justify-between py-6 px-16">
          <div>
            <h2 className="font-ubuntu text-lg font-bold text-gray-900">View Reports</h2>
            <p className="font-lato text-sm text-gray-500">Monitor and manage civic issue reports</p>
            {/*<img src="./image 2.svg" alt="map" className='w-full h-auto mt-4 rounded-lg shadow-md'/>*/}
            <IssuesMap />

          </div>   
        </div>     
    </div>
)
}

export default Admin