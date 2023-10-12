import React from "react";

import "../scss/footer.scss";

const Footer = () => {
  return (
    <div className='footer flex-container flex-column flex-align-start flex-justify-center'>
      <nav className='flex-container flex-justify-start flex-align-center'>
        <a href='https://github.com/Stillwell-C/gram-copy'>About</a>
        <a href='https://github.com/Stillwell-C'>Github</a>
        <a href='#'>Press</a>
        <a href='https://github.com/Stillwell-C/gram-copy-api'>API</a>
        <a href='#'>Jobs</a>
        <a href='#'>Privacy</a>
        <a href='#'>Terms</a>
        <a href='#'>Locations</a>
        <a href='#'>Language</a>
      </nav>
      <span className='copyright'>© Stillwell-C</span>
    </div>
  );
};

export default Footer;
