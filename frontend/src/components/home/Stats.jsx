import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import './Stats.css';

const CountUp = ({ end, duration = 2000, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);

  useEffect(() => {
    if (inView) {
      const startTime = Date.now();
      const timer = setTimeout(() => {
        let frame = 0;
        const counter = setInterval(() => {
          frame++;
          const progress = frame / totalFrames;
          setCount(Math.round(end * progress));

          if (frame === totalFrames) {
            clearInterval(counter);
            setCount(end); // Ensure it ends on the exact number
          }
        }, frameRate);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [inView, end, duration, totalFrames, frameRate, delay]);

  const formatNumber = (num) => {
      return num.toLocaleString() + (end > 10000 ? '+' : '');
  }

  return <h3 ref={ref}>{formatNumber(count)}</h3>;
};

const Stats = () => {
  return (
    <section id="stats" className="stats-section">
      <div className="container">
        <div className="stats-grid">
          <div className="stat-item">
            <CountUp end={25} delay={0} />
            <p>Years of Experience</p>
          </div>
          <div className="stat-item">
            <CountUp end={5000000} delay={500} />
            <p>Labels Produced Annually</p>
          </div>
          <div className="stat-item">
            <CountUp end={1000} delay={1000} />
            <p>Happy Clients Served</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;