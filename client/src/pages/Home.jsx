// import React from 'react'
// import { CSSTransition, TransitionGroup } from 'react-transition-group';
// import { motion } from 'framer-motion';
// import MyRings from '../components/Rings';


// export default function Home() {
//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.8 }}  // 初始时，透明度为0，缩放为0.8
//       animate={{ opacity: 1, scale: 1 }}  // 动画结束时，透明度为1，缩放为1
//       exit={{ opacity: 0, scale: 0.8 }}   // 退出时，透明度为0，缩放为0.8
//       transition={{ duration: 1.5, ease: "easeInOut" }}  // 增加动画持续时间到1.5秒，并使用"easeInOut"过渡效果
//       className='min-h-screen'
//     >
//       <MyRings />
//     </motion.div>
//   );
// }

import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three';
import Rings from '../../node_modules/vanta/dist/vanta.rings.js'


const Home= (props) => {
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
export default Home
