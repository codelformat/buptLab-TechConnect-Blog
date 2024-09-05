import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
const ScrollToTop = ()=>{
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0) }, [pathname]);
  // return null;
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);
  return null;
}
export default ScrollToTop;