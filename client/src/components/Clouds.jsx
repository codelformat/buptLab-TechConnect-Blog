import React, { useState, useEffect, useRef } from 'react'
import BIRDS from 'vanta/dist/vanta.birds.min'
import * as THREE from 'three'; // Import three.js explicitly
import CLOUDS from 'vanta/dist/vanta.clouds.min'
// Make sure window.THREE is defined, e.g. by including three.min.js in the document head using a <script> tag

const Clouds = (props) => {
  const [vantaEffect, setVantaEffect] = useState(null)
  const myRef = useRef(null)
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(CLOUDS({
        el: myRef.current,
        THREE:THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        backgroundColor: 0xc37575,
        skyColor: 0xf503ad,
        cloudColor: 0xf7860a,
        cloudShadowColor: 0xffffff,
        sunColor: 0xf0f0f0,
        sunGlareColor: 0xc8adad,
        sunlightColor: 0xffffff,
        speed: 1.60
      }))
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])
  return <div className="flex-1 h-full rounded-3xl flex flex-col items-center justify-center" ref={myRef} >
      <div className="text-3xl font-bold">
        Welcome To Our Blog!
      </div>
  </div>
}

// Exporting MyComponent so it can be used in other files
export default Clouds
