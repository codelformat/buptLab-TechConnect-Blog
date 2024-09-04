import React, { useEffect } from 'react';
import '../index.css'; // 引入全局 CSS 文件

const About = () => {
  useEffect(() => {
    const handleScroll = () => {
      const value = window.scrollY;
      const stars = document.getElementById('stars');
      const moon = document.getElementById('moon');
      const mountainsBehind = document.getElementById('mountains_behind');
      const mountainsFront = document.getElementById('mountains_front');
      const text = document.getElementById('text');
      const btn = document.getElementById('btn');


      if (stars) stars.style.left = value * 0.25 + 'px';
      if (moon) moon.style.top = value * 14.05 + 'px';
      if (mountainsBehind) mountainsBehind.style.top = value * 0.5 + 'px';
      if (mountainsFront) mountainsFront.style.top = value * 0 + 'px';
      if (text) {
        text.style.marginRight = value * 4 + 'px';
        text.style.marginTop = value * 1.5 + 'px';
      }
      if (btn) btn.style.marginTop = value * 1.5 + 'px';

    };

    const handleButtonClick = () => {
      document.body.classList.add('disperse-light');
    };

    window.addEventListener('scroll', handleScroll);
    const btn = document.getElementById('btn');
    if (btn) btn.addEventListener('click', handleButtonClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (btn) btn.removeEventListener('click', handleButtonClick);
    };
  }, []);

  return (
    <div>
      <section>
        <img src="/images/stars.png" id="stars" alt="Stars"/>
        <img src="/images/moon.png" id="moon" alt="Moon"/>
        <img src="/images/mountains_behind.png" id="mountains_behind" alt="Mountains Behind"/>
        <h2 id="text">About My Blog</h2>
        <a href="#sec" id="btn">Explore</a>
        <img src="/images/mountains_front.png" id="mountains_front" alt="Mountains Front"/>
      </section>
      <div className="sec glowing-gradient" id="sec">
        <h2>Parallax Scrolling Effects</h2>
        <p>
          Welcome to Sahand's Blog! This blog was created by Sahand Ghavidel as a personal project to share his thoughts and ideas with the world. Sahand is a passionate developer who loves to write about technology, coding, and everything in between.
          On this blog, you'll find weekly articles and tutorials on topics such as web development, software engineering, and programming languages. Sahand is always learning and exploring new technologies, so be sure to check back often for new content!
          We encourage you to leave comments on our posts and engage with other readers. You can like other people's comments and reply to them as well. We believe that a community of learners can help each other grow and improve.
        </p>
      </div>
    </div>
  );
};

export default About;
