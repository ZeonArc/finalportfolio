import React, { useRef, useMemo, useEffect } from 'react';
import './TargetCursor.css';

const TargetCursor = ({
  targetSelector = '.cursor-target, a, button',
  hideDefaultCursor = true,
}) => {
  const wrapperRef = useRef(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const posRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth <= 768;
  }, []);

  useEffect(() => {
    if (isMobile || !wrapperRef.current) return;

    // Hide native cursor
    if (hideDefaultCursor) {
      let styleEl = document.getElementById('target-cursor-style');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'target-cursor-style';
        styleEl.innerHTML = '*, *::before, *::after { cursor: none !important; }';
        document.head.appendChild(styleEl);
      }
    }

    const wrapper = wrapperRef.current;

    // RAF loop for smooth cursor tracking
    const tick = () => {
      posRef.current.x += (mouseRef.current.x - posRef.current.x) * 0.2;
      posRef.current.y += (mouseRef.current.y - posRef.current.y) * 0.2;
      wrapper.style.left = posRef.current.x + 'px';
      wrapper.style.top = posRef.current.y + 'px';
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const onMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const onOver = (e) => {
      let el = e.target;
      while (el && el !== document.body) {
        if (el.matches && el.matches(targetSelector)) {
          wrapper.classList.add('cursor-hovering');
          return;
        }
        el = el.parentElement;
      }
    };

    const onOut = (e) => {
      let el = e.target;
      while (el && el !== document.body) {
        if (el.matches && el.matches(targetSelector)) {
          wrapper.classList.remove('cursor-hovering');
          return;
        }
        el = el.parentElement;
      }
    };

    const onDown = () => wrapper.classList.add('cursor-clicking');
    const onUp = () => wrapper.classList.remove('cursor-clicking');

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mouseout', onOut, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      const styleEl = document.getElementById('target-cursor-style');
      if (styleEl) styleEl.remove();
    };
  }, [isMobile, hideDefaultCursor, targetSelector]);

  if (isMobile) return null;

  return (
    <div ref={wrapperRef} className="custom-cursor">
      <div className="cursor-dot" />
      <div className="cursor-ring" />
    </div>
  );
};

export default React.memo(TargetCursor);
