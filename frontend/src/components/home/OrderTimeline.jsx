import { useEffect, useRef, useState } from 'react';
import './OrderTimeline.css';

const timelineData = [
  { title: "1. Analyse Your Demand", description: "Identify the type of label you need, desired quality, and specifics for your garments." },
  { title: "2. Clear Doubts", description: "Contact us with any questions. Our team will help you choose the best options for your needs." },
  { title: "3. Place Your Order", description: "Trust our expertise. Specify the size and quantity of labels you require for a seamless process." },
  { title: "4. Check Design Customisation", description: "Review the custom design we create. Provide feedback for any changes to match your vision." },
  { title: "5. Receive Your Delivery", description: "Sit back and relax. We'll deliver your high-quality labels within a few days." }
];

const TimelineItem = ({ data, isActive, dotRef, index }) => {
  const isEven = index % 2 !== 0; // 0-indexed, so item 2 is index 1 (odd)

  return (
    <div className={`timeline-item ${isActive ? 'active' : ''} ${isEven ? 'even' : 'odd'}`}>
      <div className="timeline-dot" ref={dotRef}></div>
      <div className="timeline-spacer"></div>
      <div className="timeline-content-wrapper">
        <div className="timeline-content">
          <h3 className="font-semibold text-xl mb-2 text-main-red">{data.title}</h3>
          <p>{data.description}</p>
        </div>
      </div>
    </div>
  );
};

const OrderTimeline = () => {
  const [activeItem, setActiveItem] = useState(0);
  const containerRef = useRef(null);
  const svgPathRef = useRef(null);
  const dotRefs = useRef([]);

  useEffect(() => {
    dotRefs.current = dotRefs.current.slice(0, timelineData.length);
  }, []);

  const updatePath = () => {
    if (!svgPathRef.current || dotRefs.current.length === 0) return;

    const isMobile = window.innerWidth < 768;
    let pathData = '';
    const containerRect = containerRef.current.getBoundingClientRect();

    dotRefs.current.forEach((dot, index) => {
      if (!dot) return;
      const dotRect = dot.getBoundingClientRect();
      const x = dotRect.left - containerRect.left + (dotRect.width / 2);
      const y = dotRect.top - containerRect.top + (dotRect.height / 2);

      if (index === 0) {
        pathData += `M ${x} ${y}`;
      } else {
        const prevDot = dotRefs.current[index - 1];
        if (!prevDot) return;
        const prevDotRect = prevDot.getBoundingClientRect();
        const prevY = prevDotRect.top - containerRect.top + (prevDotRect.height / 2);

        if (isMobile) {
          pathData += ` L ${x} ${y}`;
        } else {
          const prevX = prevDotRect.left - containerRect.left + (prevDotRect.width / 2);
          const curveFactor = 80;
          // The curve direction depends on whether the current item is on the right (even index) or left (odd index)
          const cpx1 = prevX + curveFactor * (index % 2 === 0 ? -1 : 1);
          const cpy1 = prevY + (y - prevY) / 2;
          const cpx2 = x - curveFactor * (index % 2 === 0 ? -1 : 1);
          const cpy2 = y - (y - prevY) / 2;

          pathData += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${x} ${y}`;
        }
      }
    });

    svgPathRef.current.setAttribute('d', pathData);
    const pathLength = svgPathRef.current.getTotalLength();
    svgPathRef.current.style.strokeDasharray = pathLength;
    svgPathRef.current.style.strokeDashoffset = pathLength;
  };

  const handleScroll = () => {
    if (!containerRef.current || !svgPathRef.current) return;

    const { top, height } = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    let progress = (viewportHeight - top) / height;
    progress = Math.max(0, Math.min(1, progress));

    const pathLength = svgPathRef.current.getTotalLength();
    svgPathRef.current.style.strokeDashoffset = pathLength - (pathLength * progress);

    let closestItem = 0;
    let smallestDistance = Infinity;
    dotRefs.current.forEach((dot, index) => {
      if (!dot) return;
      const dist = Math.abs(dot.getBoundingClientRect().top - viewportHeight / 2);
      if (dist < smallestDistance) {
        smallestDistance = dist;
        closestItem = index;
      }
    });
    setActiveItem(closestItem);
  };

  useEffect(() => {
    setTimeout(updatePath, 100); // Allow DOM to render
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updatePath);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updatePath);
    };
  }, []);

  return (
    <section id="order" className="timeline-section">
      <div className="container">
        <h2>How to Place Your Order</h2>
        <div className="timeline-container" ref={containerRef}>
          <svg className="timeline-svg">
            <path ref={svgPathRef} fill="none" stroke="var(--main-red)" strokeWidth="4" strokeLinecap="round"></path>
          </svg>
          {timelineData.map((item, index) => (
            <TimelineItem data={item} key={index} index={index} isActive={index === activeItem} dotRef={el => dotRefs.current[index] = el} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrderTimeline;