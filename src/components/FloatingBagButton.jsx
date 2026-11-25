import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import '../styles/components/floating-bag-button.css';

export default function FloatingBagButton({
  cartCount = 0,
  onClick,
  isCartOpen = false,
}) {
  // Store offset from the bottom-right corner: { right, bottom }
  const [offset, setOffset] = useState(() => {
    try {
      const saved = localStorage.getItem('item13_bag_offset');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.right === 'number' && typeof parsed.bottom === 'number') {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    // Default: 24px from right, 88px from bottom (above mobile tabbar and page edges)
    return { right: 24, bottom: 88 };
  });

  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [savedItemMsg, setSavedItemMsg] = useState(false);
  const [isMsgExiting, setIsMsgExiting] = useState(false);
  const prevCartCountRef = useRef(cartCount);
  const savedMsgTimerRef = useRef(null);
  const exitTimerRef = useRef(null);

  const dragRef = useRef({
    startX: 0,
    startY: 0,
    initialRight: 24,
    initialBottom: 88,
    hasMoved: false,
  });

  const buttonRef = useRef(null);

  // Trigger "Your item is saved here" when adding the first item (0 -> >0)
  useEffect(() => {
    const prevCount = prevCartCountRef.current;
    prevCartCountRef.current = cartCount;

    if (prevCount === 0 && cartCount > 0) {
      if (savedMsgTimerRef.current) clearTimeout(savedMsgTimerRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);

      setIsMsgExiting(false);
      setSavedItemMsg(true);
      setShowTooltip(false); // Suppress generic tooltip

      // Stay visible for 3.2s, then transition out over 0.4s
      savedMsgTimerRef.current = setTimeout(() => {
        setIsMsgExiting(true);
        exitTimerRef.current = setTimeout(() => {
          setSavedItemMsg(false);
          setIsMsgExiting(false);
        }, 400);
      }, 3200);
    }
  }, [cartCount]);

  // Periodic tooltip: shows for 3s, then repeats every 5 minutes (300,000 ms)
  useEffect(() => {
    let hideTimer = null;

    const triggerTooltip = () => {
      setShowTooltip(true);
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        setShowTooltip(false);
      }, 3000);
    };

    // Initial display shortly after mount (1.5s delay)
    const initialTimer = setTimeout(() => {
      triggerTooltip();
    }, 1500);

    // Repeat every 5 minutes
    const intervalTimer = setInterval(() => {
      triggerTooltip();
    }, 5 * 60 * 1000);

    return () => {
      clearTimeout(initialTimer);
      if (hideTimer) clearTimeout(hideTimer);
      clearInterval(intervalTimer);
      if (savedMsgTimerRef.current) clearTimeout(savedMsgTimerRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, []);

  // Clamp within viewport if screen resizes
  useEffect(() => {
    const handleResize = () => {
      setOffset((prev) => {
        const maxRight = Math.max(16, window.innerWidth - 70);
        const maxBottom = Math.max(16, window.innerHeight - 70);
        return {
          right: Math.min(Math.max(16, prev.right), maxRight),
          bottom: Math.min(Math.max(16, prev.bottom), maxBottom),
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pointer drag listeners (desktop pointer + mobile touch)
  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;

    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);

    dragRef.current = {
      startX: clientX,
      startY: clientY,
      initialRight: offset.right,
      initialBottom: offset.bottom,
      hasMoved: false,
    };

    setIsDragging(true);

    const handlePointerMove = (moveEvent) => {
      const currentX = moveEvent.clientX ?? (moveEvent.touches && moveEvent.touches[0]?.clientX);
      const currentY = moveEvent.clientY ?? (moveEvent.touches && moveEvent.touches[0]?.clientY);

      if (currentX === undefined || currentY === undefined) return;

      const deltaX = currentX - dragRef.current.startX;
      const deltaY = currentY - dragRef.current.startY;

      if (!dragRef.current.hasMoved && Math.hypot(deltaX, deltaY) > 5) {
        dragRef.current.hasMoved = true;
      }

      if (dragRef.current.hasMoved) {
        const maxRight = Math.max(16, window.innerWidth - 70);
        const maxBottom = Math.max(16, window.innerHeight - 70);

        // Moving right decreases 'right' offset, moving down decreases 'bottom' offset
        const nextRight = Math.min(Math.max(16, dragRef.current.initialRight - deltaX), maxRight);
        const nextBottom = Math.min(Math.max(16, dragRef.current.initialBottom - deltaY), maxBottom);

        setOffset({ right: nextRight, bottom: nextBottom });
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      if (dragRef.current.hasMoved) {
        setOffset((cur) => {
          try {
            localStorage.setItem('item13_bag_offset', JSON.stringify(cur));
          } catch { }
          return cur;
        });
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);
  };

  const handleClick = (e) => {
    if (dragRef.current.hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (onClick) onClick();
  };

  // Hide floating button while the cart modal / drawer is actively open
  if (isCartOpen) return null;

  return (
    <div
      ref={buttonRef}
      className={`floating-bag-wrapper ${isDragging ? 'is-dragging' : ''}`}
      style={{
        right: `${offset.right}px`,
        bottom: `${offset.bottom}px`,
      }}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Shopping Bag (${cartCount} items)`}
      title="Drag to reposition, tap to open bag"
    >
      <div className="floating-bag-btn">
        <ShoppingBag size={22} className="floating-bag-icon" />

        {/* Small count exponent on top right */}
        {cartCount > 0 && (
          <span className="floating-bag-exponent" key={cartCount}>
            {cartCount}
          </span>
        )}

        {/* Saved item notice on first add: transitions out smoothly */}
        {savedItemMsg ? (
          <div className={`floating-bag-tooltip saved-item-tooltip ${isMsgExiting ? 'is-exiting' : ''}`} role="status">
            <span>Your item is saved here</span>
            <div className="floating-bag-tooltip-arrow" />
          </div>
        ) : (
          /* Periodic hint message popover: shows for 3s every 5 mins */
          showTooltip && (
            <div className="floating-bag-tooltip" role="tooltip">
              <span>View your cart here</span>
              <div className="floating-bag-tooltip-arrow" />
            </div>
          )
        )}
      </div>
    </div>
  );
}
