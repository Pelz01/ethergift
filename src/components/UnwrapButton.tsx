'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Gift, Sparkles, Loader2 } from 'lucide-react';

interface UnwrapButtonProps {
    onComplete: () => void;
    disabled?: boolean;
    loading?: boolean;
}

export function UnwrapButton({ onComplete, disabled, loading }: UnwrapButtonProps) {
    const [progress, setProgress] = useState(0);
    const [isHolding, setIsHolding] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const holdDuration = 2000; // 2 seconds to complete
    const updateInterval = 16; // ~60fps

    const startHold = useCallback(() => {
        if (disabled || loading) return;

        setIsHolding(true);
        const startTime = Date.now();

        intervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / holdDuration) * 100, 100);
            setProgress(newProgress);

            if (newProgress >= 100) {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
                onComplete();
            }
        }, updateInterval);
    }, [disabled, loading, onComplete]);

    const endHold = useCallback(() => {
        setIsHolding(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setProgress(0);
    }, []);

    return (
        <motion.button
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            disabled={disabled || loading}
            className={cn(
                "relative w-48 h-48 rounded-full flex items-center justify-center select-none transition-all duration-300",
                "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30",
                disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95',
                isHolding && "scale-95"
            )}
            animate={!disabled && !loading ? {
                boxShadow: [
                    '0 0 20px rgba(var(--primary), 0.3)',
                    '0 0 40px rgba(var(--primary), 0.5)',
                    '0 0 20px rgba(var(--primary), 0.3)',
                ],
            } : {}}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        >
            {/* Progress Ring */}
            <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 100 100"
            >
                <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="opacity-20"
                />
                <motion.circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={Math.PI * 92}
                    strokeDashoffset={Math.PI * 92 * (1 - progress / 100)}
                    style={{
                        filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))',
                    }}
                />
            </svg>

            {/* Content */}
            <div className="relative z-10 text-center flex flex-col items-center">
                {loading ? (
                    <>
                        <Loader2 className="w-8 h-8 mb-2 animate-spin" />
                        <span className="text-sm font-semibold">Processing...</span>
                    </>
                ) : isHolding ? (
                    <>
                        <Sparkles className="w-10 h-10 mb-2 animate-pulse" />
                        <span className="text-sm font-semibold">Keep Holding...</span>
                    </>
                ) : (
                    <>
                        <Gift className="w-12 h-12 mb-2" />
                        <span className="text-lg font-bold">UNWRAP</span>
                        <span className="text-xs mt-1 opacity-80">Hold to open</span>
                    </>
                )}
            </div>
        </motion.button>
    );
}
