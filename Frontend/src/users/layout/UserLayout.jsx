import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'


const UserLayout = ({ cartCount }) => {
  return (
    <> 
        <Navbar cartItemCount={cartCount} />
        <Outlet />
        <Footer />
    </>
  )
}

export default UserLayout;