'use client';

import { motion } from 'framer-motion';
import { formatEth } from '@/lib/contract';
import { Check, Coins } from 'lucide-react';

interface ETHRevealProps {
    amount: bigint;
    visible: boolean;
}

export function ETHReveal({ amount, visible }: ETHRevealProps) {
    if (!visible) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
            <div className="text-center relative">
                {/* Glow background */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
                </motion.div>

                {/* ETH Icon */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
                    className="relative z-10 mb-6"
                >
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/30 text-primary-foreground">
                        <Coins className="w-16 h-16" />
                    </div>
                </motion.div>

                {/* Amount */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
                    className="relative z-10"
                >
                    <h2 className="text-6xl md:text-7xl font-bold text-foreground mb-4">
                        {formatEth(amount)} <span className="text-primary">ETH</span>
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-xl text-muted-foreground p-2 rounded-full bg-background/50 backdrop-blur-sm border border-border inline-flex px-6">
                        <Check className="w-5 h-5 text-green-500" />
                        Gift Claimed Successfully!
                    </div>
                </motion.div>

                {/* Sparkles */}
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary rounded-full"
                        initial={{
                            opacity: 0,
                            x: 0,
                            y: 0,
                            scale: 0,
                        }}
                        animate={{
                            opacity: [0, 1, 0],
                            x: Math.cos((i * Math.PI * 2) / 12) * 200,
                            y: Math.sin((i * Math.PI * 2) / 12) * 200,
                            scale: [0, 1.5, 0],
                        }}
                        transition={{
                            delay: 0.6 + i * 0.05,
                            duration: 1,
                            ease: 'easeOut',
                        }}
                        style={{
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
}
