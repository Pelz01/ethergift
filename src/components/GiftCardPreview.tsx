'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Gift, Wallet } from 'lucide-react';

export type CardTemplate = 'classic' | 'ribbon' | 'bow';

interface GiftCardPreviewProps {
    template: CardTemplate;
    amount: string;
    recipient: string;
    message: string;
    className?: string;
}

export function GiftCardPreview({ template, amount, recipient, message, className }: GiftCardPreviewProps) {
    const formattedAmount = amount || '0.0';

    // Common background styles
    const cardBase = "relative w-full aspect-[1.586] rounded-xl overflow-hidden shadow-2xl transition-all duration-500 bg-white text-slate-900";

    return (
        <div className={cn("perspective-1000", className)}>
            <motion.div
                className={cardBase}
                initial={{ rotateY: 10 }}
                animate={{ rotateY: 0 }}
                whileHover={{ rotateY: 5, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                {/* TEMPLATE: CLASSIC (Simple, clean, gold accents) */}
                {template === 'classic' && (
                    <div className="h-full flex flex-col p-8 border-[12px] border-amber-500/20">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2 text-amber-600">
                                <Gift className="w-6 h-6" />
                                <span className="font-bold tracking-widest text-sm">ETHERGIFT</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold font-mono tracking-tighter text-slate-800">
                                    {formattedAmount} <span className="text-sm text-slate-500 font-sans">ETH</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 flex items-center justify-center text-center my-4">
                            <p className="font-serif italic text-2xl text-slate-600 leading-relaxed max-h-24 overflow-hidden">
                                "{message || 'Your personal message here...'}"
                            </p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                            <div>
                                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">To Recipient</div>
                                <div className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                    {recipient ? `${recipient.slice(0, 6)}...${recipient.slice(-4)}` : '0x000...0000'}
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                <Wallet className="w-4 h-4 text-amber-600" />
                            </div>
                        </div>
                    </div>
                )}

                {/* TEMPLATE: RIBBON (Horizontal Red Ribbon) */}
                {template === 'ribbon' && (
                    <div className="h-full flex flex-col relative bg-stone-50">
                        {/* Ribbon Horizontal */}
                        <div className="absolute top-1/2 left-0 right-0 h-16 -mt-8 bg-red-600 shadow-lg z-10 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 border-y-2 border-red-400/50"></div>
                            <div className="text-white/20 font-bold uppercase tracking-[0.5em] text-xs">Wrapped with care</div>
                        </div>

                        {/* Bow Center (CSS Shapes) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-24 h-24 pointer-events-none">
                            <div className="absolute inset-0 flex items-center justify-center">
                                {/* Left Loop */}
                                <div className="w-10 h-10 rounded-full border-[6px] border-red-700 bg-red-600 -mr-2 rounded-br-none shadow-md transform -rotate-12"></div>
                                {/* Right Loop */}
                                <div className="w-10 h-10 rounded-full border-[6px] border-red-700 bg-red-600 -ml-2 rounded-bl-none shadow-md transform rotate-12"></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                {/* Knot */}
                                <div className="w-6 h-6 bg-red-800 rounded-full shadow-inner z-30"></div>
                            </div>
                        </div>

                        <div className="h-1/2 p-6 flex justify-between items-start">
                            <div className="text-center w-full pt-2">
                                <h2 className="text-4xl font-serif text-amber-500 font-bold tracking-widest drop-shadow-sm">GIFT CARD</h2>
                            </div>
                        </div>

                        <div className="h-1/2 p-6 flex flex-col justify-end items-center z-20 mt-8">
                            <div className="text-3xl font-bold text-slate-800 bg-white/80 px-4 py-1 rounded-full shadow-sm backdrop-blur-sm">
                                {formattedAmount} ETH
                            </div>
                            <p className="text-sm text-slate-500 mt-2 font-medium max-w-[80%] text-center truncate">
                                {message || 'A special gift for you'}
                            </p>
                        </div>
                    </div>
                )}

                {/* TEMPLATE: BOW (Corner Bow) */}
                {template === 'bow' && (
                    <div className="h-full flex flex-col bg-white border border-slate-200">
                        {/* Vertical Ribbon */}
                        <div className="absolute top-0 bottom-0 left-[30%] w-12 bg-red-600 shadow-sm z-10 border-x border-red-700/20"></div>
                        {/* Horizontal Ribbon */}
                        <div className="absolute top-[35%] left-0 right-0 h-12 bg-red-600 shadow-sm z-10 border-y border-red-700/20"></div>

                        {/* Intersection Bow */}
                        <div className="absolute top-[35%] left-[30%] w-12 h-12 z-20 flex items-center justify-center">
                            <div className="w-16 h-16 bg-red-700/0 relative -ml-2 -mt-2">
                                {/* Simplified Bow SVG */}
                                <svg viewBox="0 0 100 100" className="w-full h-full text-red-700 fill-current drop-shadow-lg transform scale-150">
                                    <path d="M50 50 C20 20 20 80 50 50 C80 80 80 20 50 50" stroke="currentColor" strokeWidth="15" fill="none" />
                                    <circle cx="50" cy="50" r="12" fill="#991b1b" />
                                </svg>
                            </div>
                        </div>

                        <div className="absolute top-8 right-8 text-right z-0">
                            <div className="text-5xl font-serif text-slate-800 font-bold opacity-10">ETH</div>
                        </div>

                        <div className="flex-1 z-30 flex flex-col justify-end p-8 text-right items-end">
                            <h3 className="text-2xl font-serif font-bold text-slate-800 mb-1">Gift Card</h3>
                            <div className="text-4xl font-bold text-amber-600 mb-4">{formattedAmount} ETH</div>
                            <div className="text-sm text-slate-500 font-medium bg-white/90 p-2 rounded shadow-sm max-w-[200px]">
                                {message || 'Enjoy your gift!'}
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Reflection/Shadow underneath */}
            <div className="absolute -bottom-4 left-4 right-4 h-4 bg-black/20 blur-xl rounded-full opacity-60"></div>
        </div>
    );
}
