// /client/src/components/Net.jsx
import React, { useState, useEffect, useRef } from 'react'
import * as THREE from 'three';
import NET from '../../node_modules/vanta/dist/vanta.net.js'

const Net = (props) => {
  const [vantaEffect, setVantaEffect] = useState(null)
  const myRef = useRef(null)

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(NET({
        el: myRef.current,
        THREE:THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x823fff,
        spacing: 15.00
      }))
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])
  return (
    <div className="min-h-screen" ref={myRef} >
      {/* <div className="text-3xl font-bold">
        Welcome To Our Blog!
      </div> */}
    </div>
  )
}

// Exporting MyComponent so it can be used in other files
export default Net
