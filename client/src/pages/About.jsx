import React, { useEffect } from 'react';
import './About.css'; // 引入全局 CSS 文件

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
        <img src="/images/stars.png" id="stars" alt="Stars" />
        <img src="/images/moon.png" id="moon" alt="Moon" />
        <img src="/images/mountains_behind.png" id="mountains_behind" alt="Mountains Behind" />
        <h2 id="text">About My Blog</h2>
        <a href="#sec" id="btn">Explore</a>
        <img src="/images/mountains_front.png" id="mountains_front" alt="Mountains Front" />
      </section>

      <div className="sec glowing-gradient" id="sec">
        <h2>Parallax Scrolling Effects</h2>
        <p>
          Welcome to Sahand's Blog! This blog was created by Sahand Ghavidel as a personal project to share his thoughts and ideas with the world. Sahand is a passionate developer who loves to write about technology, coding, and everything in between.
        </p>
      </div>

      {/* Timeline Section */}
      <div className="timeline-container">
        <h2 className="timeline-header">Timeline</h2>
        <div className="timeline">
          <div className="timeline-item left">
            <div className="timeline-date">2018</div>
            <div className="timeline-content">V7 Birth</div>
          </div>
          <div className="timeline-item right">
            <div className="timeline-date">2019</div>
            <div className="timeline-content">Beta Version Released</div>
          </div>
          <div className="timeline-item left">
            <div className="timeline-date">2020</div>
            <div className="timeline-content">Darwin Version Released</div>
          </div>
          <div className="timeline-item right">
            <div className="timeline-date">2021</div>
            <div className="timeline-content">Team Growth</div>
          </div>
          <div className="timeline-item left">
            <div className="timeline-date">2022</div>
            <div className="timeline-content">Fundraising</div>
          </div>
          <div className="timeline-item right">
            <div className="timeline-date">2023</div>
            <div className="timeline-content">Important Meetings</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;