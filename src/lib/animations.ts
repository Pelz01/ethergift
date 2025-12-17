import { Variants } from 'framer-motion';

// Page transition variants
export const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.4,
        },
    },
};

// Stagger children animation
export const staggerContainer: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

export const staggerItem: Variants = {
    initial: {
        opacity: 0,
        y: 30,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

// Fade in from different directions
export const fadeIn = (direction: 'up' | 'down' | 'left' | 'right' = 'up', delay = 0): Variants => ({
    initial: {
        opacity: 0,
        x: direction === 'left' ? -40 : direction === 'right' ? 40 : 0,
        y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
    },
    animate: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
            duration: 0.6,
            delay,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
});

// Scale animations
export const scaleIn: Variants = {
    initial: {
        opacity: 0,
        scale: 0.8,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

// Button hover/tap animations
export const buttonVariants: Variants = {
    initial: {
        scale: 1,
    },
    hover: {
        scale: 1.02,
        transition: {
            duration: 0.2,
        },
    },
    tap: {
        scale: 0.98,
    },
};

// Pulsing glow animation
export const pulseGlow: Variants = {
    initial: {
        boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
    },
    animate: {
        boxShadow: [
            '0 0 20px rgba(212, 175, 55, 0.3)',
            '0 0 40px rgba(212, 175, 55, 0.6)',
            '0 0 20px rgba(212, 175, 55, 0.3)',
        ],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

// Modal backdrop
export const backdropVariants: Variants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.3,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2,
        },
    },
};

// Modal content
export const modalVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0.9,
        y: 20,
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: 20,
        transition: {
            duration: 0.3,
        },
    },
};

// Shake animation for the 3D box
export const shakeAnimation = {
    x: [0, -5, 5, -5, 5, -3, 3, 0],
    rotateZ: [0, -2, 2, -2, 2, -1, 1, 0],
    transition: {
        duration: 0.5,
        ease: 'easeInOut',
    },
};

// Particle explosion (for ETH reveal)
export const particleVariants = (index: number): Variants => ({
    initial: {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
    },
    animate: {
        opacity: 0,
        scale: 0,
        x: Math.cos((index * Math.PI * 2) / 12) * 200,
        y: Math.sin((index * Math.PI * 2) / 12) * 200,
        transition: {
            duration: 1,
            ease: 'easeOut',
        },
    },
});

// ETH amount reveal
export const ethRevealVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0,
        rotateY: -180,
    },
    animate: {
        opacity: 1,
        scale: 1,
        rotateY: 0,
        transition: {
            duration: 0.8,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

// Progress bar for long press
export const progressVariants: Variants = {
    initial: {
        scaleX: 0,
        transformOrigin: 'left',
    },
    animate: {
        scaleX: 1,
        transition: {
            duration: 2,
            ease: 'linear',
        },
    },
};

// Box folding animation (2D to 3D effect)
export const boxFoldVariants: Variants = {
    flat: {
        rotateX: 0,
        rotateY: 0,
        z: 0,
    },
    folded: {
        rotateX: 15,
        rotateY: -15,
        z: 50,
        transition: {
            duration: 1.5,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};
