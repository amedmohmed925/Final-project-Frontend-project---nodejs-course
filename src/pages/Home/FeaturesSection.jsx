import React, { useEffect, useRef } from 'react';
import './FeaturesSection.css';
import { Link } from 'react-router-dom';

const FeaturesSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const icons = sectionRef.current.querySelectorAll('.feature-icon');

    const handleMouseMove = (e) => {
      const rect = sectionRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      icons.forEach((icon, index) => {
        const speed = 0.015 + index * 0.005; // تقليل السرعة لتحريك أبطأ
        const baseX = parseFloat(icon.dataset.baseX) || 0;
        const baseY = parseFloat(icon.dataset.baseY) || 0;

        // حساب الإزاحة بناءً على موقع الماوس
        const offsetX = (mouseX - baseX) * speed;
        const offsetY = (mouseY - baseY) * speed;

        // إضافة تأثير مرونة للسلاسة
        const currentX = parseFloat(icon.style.getPropertyValue('--x')) || 0;
        const currentY = parseFloat(icon.style.getPropertyValue('--y')) || 0;
        const newX = currentX + (offsetX - currentX) * 0.1; // زيادة السلاسة
        const newY = currentY + (offsetY - currentY) * 0.1;

        icon.style.setProperty('--x', newX);
        icon.style.setProperty('--y', newY);
        icon.style.transform = `translate(${newX}px, ${newY}px)`;
      });
    };

    const handleMouseLeave = () => {
      icons.forEach((icon) => {
        icon.style.transform = `translate(0px, 0px)`; // إعادة الأيقونات للمركز
        icon.style.setProperty('--x', 0);
        icon.style.setProperty('--y', 0);
      });
    };

    const section = sectionRef.current;
    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseleave', handleMouseLeave);

    // تعيين المواقع الأساسية للأيقونات
    icons.forEach((icon) => {
      const rect = icon.getBoundingClientRect();
      const sectionRect = sectionRef.current.getBoundingClientRect();
      const baseX = rect.left - sectionRect.left + rect.width / 2;
      const baseY = rect.top - sectionRect.top + rect.height / 2;
      icon.dataset.baseX = baseX;
      icon.dataset.baseY = baseY;
    });

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // تحديد مواقع الأيقونات يدويًا
  const iconPositions = [
    { top: '10%', left: '10%', icon: 'book' },
    { top: '15%', left: '80%', icon: 'graduation-cap' },
    { top: '25%', left: '20%', icon: 'chalkboard-teacher' },
    { top: '30%', left: '70%', icon: 'pencil-alt' },
    { top: '40%', left: '15%', icon: 'school' },
    { top: '50%', left: '85%', icon: 'user-graduate' },
    { top: '60%', left: '25%', icon: 'book-reader' },
    { top: '70%', left: '75%', icon: 'laptop' },
    { top: '80%', left: '20%', icon: 'video' },
    { top: '85%', left: '80%', icon: 'certificate' },
  ];

  const renderIcons = () => {
    return iconPositions.map((pos, index) => (
      <div
        key={index}
        className="feature-icon"
        style={{ top: pos.top, left: pos.left }}
        data-base-x="0"
        data-base-y="0"
      >
        <i className={`fas fa-${pos.icon}`}></i>
      </div>
    ));
  };

  return (
    <section className="features-section" ref={sectionRef}>
      <div className="content">
        <h2>
          Achieve <span>mastery</span> through challenge
        </h2>
        <p>
          Improve your development skills by training  EduQuest that continuously challenge and push your coding practice.
        </p>
        <Link to={"/courses"}>
        <button className="get-started-btn">Get Started</button>
        </Link>
      </div>
      <div className="icons-container">{renderIcons()}</div>
    </section>
  );
};

export default FeaturesSection;