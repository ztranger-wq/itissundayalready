import { useState, useEffect } from 'react';
import './ScrollProgressBar.css';

const ScrollProgressBar = () => {
  const [scroll, setScroll] = useState(0);

  const onScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollHeight === clientHeight) {
        setScroll(100);
        return;
    }
    const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScroll(scrolled);
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${scroll}%` }}></div>
    </div>
  );
};

export default ScrollProgressBar;