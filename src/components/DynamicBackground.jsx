import React, { useEffect, useState, useRef } from 'react';

export default function DynamicBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tiltPos, setTiltPos] = useState({ x: 0, y: 0 });

  // Handle desktop mouse movement parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 40;
      const y = (e.clientY / innerHeight - 0.5) * 40;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle Mobile Device Orientation (Gyroscope / Tilt) for interactive mobile background
  useEffect(() => {
    const handleDeviceOrientation = (event) => {
      if (event.gamma !== null && event.beta !== null) {
        // gamma is left-to-right [-90,90], beta is front-to-back [-180,180]
        const tiltX = Math.max(-25, Math.min(25, event.gamma * 0.8));
        const tiltY = Math.max(-25, Math.min(25, (event.beta - 45) * 0.8));
        setTiltPos({ x: tiltX, y: tiltY });
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
    }
    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

  // Combined parallax offset
  const offsetX = mousePos.x + tiltPos.x;
  const offsetY = mousePos.y + tiltPos.y;

  // Generate lightweight ambient floating particles (kernels & fizzy bubbles)
  const particles = [
    { id: 1, size: 6, left: '8%', delay: '0s', duration: '14s', bg: 'rgba(245, 158, 11, 0.4)' },
    { id: 2, size: 9, left: '22%', delay: '4s', duration: '18s', bg: 'rgba(168, 85, 247, 0.35)' },
    { id: 3, size: 5, left: '38%', delay: '2s', duration: '12s', bg: 'rgba(255, 255, 255, 0.4)' },
    { id: 4, size: 11, left: '55%', delay: '6s', duration: '16s', bg: 'rgba(245, 158, 11, 0.3)' },
    { id: 5, size: 7, left: '72%', delay: '1s', duration: '15s', bg: 'rgba(56, 189, 248, 0.35)' },
    { id: 6, size: 10, left: '88%', delay: '5s', duration: '20s', bg: 'rgba(244, 63, 94, 0.3)' },
    { id: 7, size: 6, left: '94%', delay: '8s', duration: '13s', bg: 'rgba(245, 158, 11, 0.35)' },
  ];

  return (
    <div className="dynamic-background-container" aria-hidden="true">
      {/* Living animated aurora mesh */}
      <div className="aurora-mesh" />

      {/* Floating interactive blurred orbs with gyroscope & cursor tracking */}
      <div
        className="floating-orb orb-caramel"
        style={{
          transform: `translate(${offsetX * 0.7}px, ${offsetY * 0.7}px)`,
        }}
      />
      <div
        className="floating-orb orb-fizzy"
        style={{
          transform: `translate(${-offsetX * 0.5}px, ${-offsetY * 0.5}px)`,
        }}
      />
      <div
        className="floating-orb orb-accent"
        style={{
          transform: `translate(${offsetX * 0.3}px, ${-offsetY * 0.3}px)`,
        }}
      />

      {/* Floating food sparks & carbonation bubbles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="ambient-particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            backgroundColor: p.bg,
            boxShadow: `0 0 10px ${p.bg}`,
          }}
        />
      ))}

      {/* Subtle grainy organic texture */}
      <div className="noise-overlay" />
    </div>
  );
}
