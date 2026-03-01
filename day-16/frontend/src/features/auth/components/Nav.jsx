import React from 'react'
import '../style/nav.scss'
import { useNavigate } from 'react-router'

const Nav = () => {

    const Navigate = useNavigate()
  return (
    <nav className='nav-bar'>
        <p>Insta</p>
        <button onClick={()=>{Navigate('/create-post')}} className='button primary-button'>New Post</button>
    </nav>
  )
}

export default Nav
