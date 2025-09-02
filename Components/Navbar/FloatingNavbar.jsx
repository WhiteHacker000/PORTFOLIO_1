import React from 'react';
import './Navbar.css';
import logo from '../../Assets/Logo/Logo.png';

const FloatingNavbar = () => (
  <nav className="floating-navbar">
    <img src={logo} alt="Logo" className="navbar-logo" />
    <ul className="navbar-links">
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#projects">Projects</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </nav>
);

export default FloatingNavbar; 