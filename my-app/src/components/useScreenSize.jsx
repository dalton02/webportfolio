// useScreenSize.js
import { useState, useEffect } from 'react';

  
  
  const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    type: 1 
  });

  useEffect(() => {

    if(window.innerWidth<800){
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
        type: .5
      });
    }

    const handleResize = () => {
      let x;
      if(window.innerWidth<800) x = 0.5;
      else x = 1;
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
        type: x
      });

    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return screenSize;
};

export default useScreenSize;