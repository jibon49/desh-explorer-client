import React, { PureComponent } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../pages/Shared/Footer/Footer'
import Navbar from '../pages/Shared/Navbar/Navbar'

export class Main extends PureComponent {
  render() {
    return (
      <div>
        <Navbar></Navbar>
        <Outlet></Outlet>
        <Footer></Footer>
      </div>
    )
  }
}

export default Main