'use client';

import { cn } from '../../lib/utils';
import {
  AnimatePresence,
  motion,
  TargetAndTransition,
  Variants,
} from 'framer-motion';
import React from 'react';

type PresetType = 'blur' | 'shake' | 'scale' | 'fade' | 'slide';

type AnimatedGroupProps = {
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  className?: string;
  preset?: PresetType;
  delay?: number;
  trigger?: boolean;
  onAnimationComplete?: () => void;
};

const defaultStaggerTimes: Record<'char' | 'word' | 'line', number> = {
  char: 0.03,
  word: 0.05,
  line: 0.1,
};

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
  exit: { opacity: 0 },
};

const presetVariants: Record<
  PresetType,
  { container: Variants; item: Variants }
> = {
  blur: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: 'blur(12px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
      exit: { opacity: 0, filter: 'blur(12px)' },
    },
  },
  shake: {
    container: defaultContainerVariants,
    item: {
      hidden: { x: 0 },
      visible: { x: [-5, 5, -5, 5, 0], transition: { duration: 0.5 } },
      exit: { x: 0 },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0 },
    },
  },
  fade: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
  },
};

export function AnimatedGroup({
  children,
  as = 'div',
  variants,
  className,
  preset,
  delay = 0,
  trigger = true,
  onAnimationComplete,
}: AnimatedGroupProps) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;
  const selectedVariants = preset
    ? presetVariants[preset]
    : { container: defaultContainerVariants, item: defaultItemVariants };
  const containerVariants = variants?.container || selectedVariants.container;

  const delayedContainerVariants: Variants = {
    hidden: containerVariants.hidden,
    visible: {
      ...containerVariants.visible,
      transition: {
        ...(containerVariants.visible as TargetAndTransition)?.transition,
        staggerChildren:
          (containerVariants.visible as TargetAndTransition)?.transition
            ?.staggerChildren || 0.05,
        delayChildren: delay,
      },
    },
    exit: containerVariants.exit,
  };

  return (
    <AnimatePresence mode='popLayout'>
      {trigger && (
        <MotionTag
          initial='hidden'
          animate='visible'
          exit='exit'
          variants={delayedContainerVariants}
          className={cn('whitespace-pre-wrap', className)}
          onAnimationComplete={onAnimationComplete}
        >
          {children}
        </MotionTag>
      )}
    </AnimatePresence>
  );
}