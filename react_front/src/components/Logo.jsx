import React from 'react';
import pentakeysLogo from './pentakeys_logo.png'; // Place l'image fournie dans src/pentakeys_logo.png

const Logo = () => (
  <div className="logo-container">
    <img src={pentakeysLogo} alt="Pentakeys Logo" className="logo-img" />
    {/* <h1 className="logo-title">PENTAKeys</h1> */}
  </div>
);

export default Logo;