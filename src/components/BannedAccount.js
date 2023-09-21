import React from "react";
import prohibited from "../assets/blocked-svgrepo-com.svg";

const BannedAccount = () => {
  return (
    <main className='fg-1 banned-page flex-container flex-column flex-align-center gap-1'>
      <img alt='' src={prohibited} />
      <h2>User Banned</h2>
      <p>This user has been banned for violating community standards.</p>
    </main>
  );
};

export default BannedAccount;
