import React from 'react'
import {Outlet} from "react-router-dom"
import "./Dashboard.css"
import Navbar from "../Components/Navigation/Navbar"

const Dashboard = () => {
  return<>
  
  <section className="dashboard-section">
    <div className="dynamic-components">
    <Outlet/>
    </div>
  </section>
  </>
}

export default Dashboard
