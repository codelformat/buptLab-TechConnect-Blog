import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three';
import Rings from '../../node_modules/vanta/dist/vanta.rings.js'


const MyRings= (props) => {
  const [vantaEffect, setVantaEffect] = useState(null)
  const myRef = useRef(null)

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(Rings({
        el: myRef.current,
        THREE:THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x8600ff,
        backgroundColor: 0x000000,
      }))
    }
    return () => {
      //if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])
  return (
    <div className="min-h-screen flex items-center" ref={myRef}>
      <div className="text-8xl text-left leading-relaxed pl-20 font-normal">
        Welcome<br />To Our <br/> Blog!
        <div>
          <Link
            to="/posts"
            className="text-xl text-left align-text-top leading-relaxed font-normal underline">
            点击进入
          </Link>
        </div>
      </div>
    </div>
  )
}

// Exporting MyComponent so it can be used in other files
export default MyRings
