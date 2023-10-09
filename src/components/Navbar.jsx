import React from 'react';
import logo from '../assets/frame.png';

export default function Navbar() {
  return (
    <nav>
    <div class='logo-container'>
      <img src={logo} alt="logo" />
      <h2>Shool-Qr-Scanner</h2>
    </div>
    </nav>
  );
}
