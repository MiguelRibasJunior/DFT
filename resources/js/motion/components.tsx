import React, { forwardRef, useEffect, useRef, useState, useMemo } from 'react';
import { useReducedMotion } from './useReducedMotion';
import { getAccessibleVariant, type MotionVariants, type MotionTransition, type MotionStyleProperties } from './variants';

export interface ViewportOptions {
  once?: boolean;
  amount?: number | 'some' | 'all';
  margin?: string;
}

export interface MotionProps {
  initial?: string | MotionStyleProperties | false;
  animate?: string | MotionStyleProperties;
  whileInView?: string | MotionStyleProperties;
  viewport?: ViewportOptions;
  whileHover?: string | MotionStyleProperties;
  whileTap?: string | MotionStyleProperties;
  variants?: MotionVariants;
  transition?: MotionTransition;
}

export type HTMLMotionProps<T extends HTMLElement> = React.HTMLAttributes<T> & MotionProps;

/**
 * Cria um componente HTML declarativo animado com suporte nativo a redução de movimento
 */
function createMotionComponent<T extends HTMLElement, P extends React.HTMLAttributes<T>>(
  Tag: keyof React.JSX.IntrinsicElements
) {
  const Component = forwardRef<T, P & MotionProps>((props, externalRef) => {
    const {
      initial = 'hidden',
      animate,
      whileInView,
      viewport = { once: true, amount: 0.15 },
      whileHover,
      whileTap,
      variants,
      transition: propTransition,
      style: customStyle = {},
      className = '',
      children,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      ...rest
    } = props;

    const internalRef = useRef<T | null>(null);
    const prefersReducedMotion = useReducedMotion();
    const [isInView, setIsInView] = useState(!whileInView);
    const [isHovered, setIsHovered] = useState(false);
    const [isTapped, setIsTapped] = useState(false);

    // Configuração do IntersectionObserver para whileInView
    useEffect(() => {
      if (!whileInView) return;

      const element = internalRef.current;
      if (!element) return;

      if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        setIsInView(true);
        return;
      }

      const threshold = typeof viewport.amount === 'number' ? viewport.amount : 0.15;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (viewport.once) {
              observer.unobserve(element);
            }
          } else if (!viewport.once) {
            setIsInView(false);
          }
        },
        { threshold, rootMargin: viewport.margin || '0px' }
      );

      observer.observe(element);
      return () => observer.disconnect();
    }, [whileInView, viewport.once, viewport.amount, viewport.margin]);

    // Resolução de variantes adaptadas à redução de movimento
    const activeVariants = useMemo(() => {
      return getAccessibleVariant(variants, prefersReducedMotion);
    }, [variants, prefersReducedMotion]);

    // Determina o estado visual atual
    const computedStyles = useMemo<React.CSSProperties>(() => {
      const base: React.CSSProperties = { ...customStyle };

      // Se redução de movimento estiver ativa, aplica estilo final estático ou fade suave
      if (prefersReducedMotion) {
        return {
          ...base,
          opacity: 1,
          transform: 'none',
          transition: 'opacity 0.15s ease-out',
        };
      }

      const resolveProperties = (target?: string | MotionStyleProperties): MotionStyleProperties => {
        if (!target) return {};
        if (typeof target === 'string') {
          return activeVariants?.[target] || {};
        }
        return target;
      };

      const initialState = initial !== false ? resolveProperties(initial) : {};
      const viewState = whileInView && isInView ? resolveProperties(whileInView) : {};
      const animState = animate ? resolveProperties(animate) : {};
      const hoverState = isHovered && whileHover ? resolveProperties(whileHover) : {};
      const tapState = isTapped && whileTap ? resolveProperties(whileTap) : {};

      // Combina propriedades ativas
      const activeState = {
        ...initialState,
        ...animState,
        ...viewState,
        ...hoverState,
        ...tapState,
      };

      const duration =
        activeState.transition?.duration ??
        propTransition?.duration ??
        0.5;

      const delay =
        activeState.transition?.delay ??
        propTransition?.delay ??
        0;

      const ease =
        Array.isArray(activeState.transition?.ease)
          ? `cubic-bezier(${activeState.transition.ease.join(',')})`
          : activeState.transition?.ease || 'cubic-bezier(0.16, 1, 0.3, 1)';

      const transforms: string[] = [];
      if (activeState.x !== undefined) {
        transforms.push(`translateX(${typeof activeState.x === 'number' ? `${activeState.x}px` : activeState.x})`);
      }
      if (activeState.y !== undefined) {
        transforms.push(`translateY(${typeof activeState.y === 'number' ? `${activeState.y}px` : activeState.y})`);
      }
      if (activeState.scale !== undefined) {
        transforms.push(`scale(${activeState.scale})`);
      }
      if (activeState.rotate !== undefined) {
        transforms.push(`rotate(${typeof activeState.rotate === 'number' ? `${activeState.rotate}deg` : activeState.rotate})`);
      }

      return {
        ...base,
        opacity: activeState.opacity !== undefined ? activeState.opacity : base.opacity,
        transform: transforms.length > 0 ? transforms.join(' ') : base.transform,
        transition: `opacity ${duration}s ${ease} ${delay}s, transform ${duration}s ${ease} ${delay}s`,
        willChange: 'opacity, transform',
      };
    }, [
      customStyle,
      prefersReducedMotion,
      initial,
      animate,
      whileInView,
      isInView,
      isHovered,
      whileHover,
      isTapped,
      whileTap,
      activeVariants,
      propTransition,
    ]);

    const setRefs = (el: T | null) => {
      internalRef.current = el;
      if (typeof externalRef === 'function') {
        externalRef(el);
      } else if (externalRef) {
        (externalRef as React.MutableRefObject<T | null>).current = el;
      }
    };

    return React.createElement(
      Tag,
      {
        ...rest,
        ref: setRefs,
        style: computedStyles,
        className,
        onMouseEnter: (e: React.MouseEvent<T>) => {
          setIsHovered(true);
          onMouseEnter?.(e as any);
        },
        onMouseLeave: (e: React.MouseEvent<T>) => {
          setIsHovered(false);
          setIsTapped(false);
          onMouseLeave?.(e as any);
        },
        onMouseDown: (e: React.MouseEvent<T>) => {
          setIsTapped(true);
          onMouseDown?.(e as any);
        },
        onMouseUp: (e: React.MouseEvent<T>) => {
          setIsTapped(false);
          onMouseUp?.(e as any);
        },
      },
      children
    );
  });

  Component.displayName = `motion.${String(Tag)}`;
  return Component;
}

/**
 * Objeto `motion` declarativo para tags HTML padrão
 */
export const motion = {
  div: createMotionComponent<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>('div'),
  section: createMotionComponent<HTMLElement, React.HTMLAttributes<HTMLElement>>('section'),
  article: createMotionComponent<HTMLElement, React.HTMLAttributes<HTMLElement>>('article'),
  header: createMotionComponent<HTMLElement, React.HTMLAttributes<HTMLElement>>('header'),
  footer: createMotionComponent<HTMLElement, React.HTMLAttributes<HTMLElement>>('footer'),
  nav: createMotionComponent<HTMLElement, React.HTMLAttributes<HTMLElement>>('nav'),
  main: createMotionComponent<HTMLElement, React.HTMLAttributes<HTMLElement>>('main'),
  aside: createMotionComponent<HTMLElement, React.HTMLAttributes<HTMLElement>>('aside'),
  span: createMotionComponent<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>('span'),
  p: createMotionComponent<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>('p'),
  h1: createMotionComponent<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>('h1'),
  h2: createMotionComponent<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>('h2'),
  h3: createMotionComponent<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>('h3'),
  h4: createMotionComponent<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>('h4'),
  button: createMotionComponent<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>('button'),
  a: createMotionComponent<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>('a'),
  ul: createMotionComponent<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>('ul'),
  li: createMotionComponent<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>('li'),
};
