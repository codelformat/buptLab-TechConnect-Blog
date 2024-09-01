import React, { useState, useEffect, useRef } from 'react'
import * as THREE from 'three';
import WAVES from 'vanta/dist/vanta.waves.min.js';

const Waves = (props) => {
  const [vantaEffect, setVantaEffect] = useState(null)
  const myRef = useRef(null)

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(WAVES({
        el: myRef.current,
        THREE:THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xbc85e1,
      }))
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])
  return <div className="flex-1 h-full rounded-3xl flex flex-col items-center justify-center" ref={myRef} >
      {/* <div className="text-3xl font-bold">
        Welcome To Our Blog!
      </div> */}
  </div>
}

// Exporting MyComponent so it can be used in other files
export default Waves
