import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from '../components/Nav/Nav'

function Applayout() {
  return (
    <>
    <Nav/>
    <Outlet/>
    </>
  )
}

export default Applayout