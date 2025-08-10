import React, { useState, useEffect } from 'react';

import WelcomeOverlay from './components/Welcome';


const App = () => {
  
  

    

  

    return (
        <div>
           {/* {isLogin ? <Login onSwitch={handleSwitch} /> : <Register onSwitch={handleSwitch} />} */}
           <WelcomeOverlay />


             {/* Google Translate Dropdown (Initially hidden, toggled from Navbar) */}
      {/* <div id="google_translate_element" className="hidden"></div> */}


        </div>
    );
};

export default App;
