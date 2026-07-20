"use client";

import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from "react";

type Animation = "fade-up" | "fade-down" | "fade-left" | "fade-right" | "fade" | "zoom-in" | "zoom-out";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: Animation;
  /** Delay in ms */
  delay?: number;
  /** Duration in ms */
  duration?: number;
  /** How much of the element should be visible before triggering (0-1) */
  threshold?: number;
  /** Extra className on the wrapper */
  className?: string;
  /** Run animation only once */
  once?: boolean;
  /** Distance in px for directional animations */
  distance?: number;
}

const getInitialStyles = (animation: Animation, distance: number): CSSProperties => {
  const base: CSSProperties = { opacity: 0 };
  switch (animation) {
    case "fade-up":
      return { ...base, transform: `translateY(${distance}px)` };
    case "fade-down":
      return { ...base, transform: `translateY(-${distance}px)` };
    case "fade-left":
      return { ...base, transform: `translateX(${distance}px)` };
    case "fade-right":
      return { ...base, transform: `translateX(-${distance}px)` };
    case "zoom-in":
      return { ...base, transform: "scale(0.92)" };
    case "zoom-out":
      return { ...base, transform: "scale(1.08)" };
    case "fade":
    default:
      return base;
  }
};

const getVisibleStyles = (): CSSProperties => ({
  opacity: 1,
  transform: "translateY(0) translateX(0) scale(1)",
});

export default function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 700,
  threshold = 0.15,
  className = "",
  once = true,
  distance = 40,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const initialStyles = getInitialStyles(animation, distance);
  const visibleStyles = getVisibleStyles();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...(isVisible ? visibleStyles : initialStyles),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

/**
 * Wrapper for staggered children animations.
 * Each direct child gets a progressive delay.
 */
interface StaggerProps {
  children: ReactNode[];
  animation?: Animation;
  /** Base delay for the first item (ms) */
  baseDelay?: number;
  /** Delay increment per item (ms) */
  stagger?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  childClassName?: string;
  once?: boolean;
  distance?: number;
}

export function ScrollRevealStagger({
  children,
  animation = "fade-up",
  baseDelay = 0,
  stagger = 100,
  duration = 600,
  threshold = 0.1,
  className = "",
  childClassName = "",
  once = true,
  distance = 30,
}: StaggerProps) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <ScrollReveal
          key={i}
          animation={animation}
          delay={baseDelay + i * stagger}
          duration={duration}
          threshold={threshold}
          className={childClassName}
          once={once}
          distance={distance}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}
