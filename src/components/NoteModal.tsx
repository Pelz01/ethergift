'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { truncateAddress } from '@/lib/contract';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { MessageSquareHeart } from 'lucide-react';

interface NoteModalProps {
    isOpen: boolean;
    sender: string;
    message: string;
    onContinue: () => void;
}

export function NoteModal({ isOpen, sender, message, onContinue }: NoteModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                    >
                        <Card className="w-full max-w-md border-primary/20 shadow-2xl">
                            <CardContent className="p-8 text-center flex flex-col items-center">
                                {/* Gift Icon */}
                                <div className="w-16 h-16 mb-6 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <MessageSquareHeart className="w-8 h-8" />
                                </div>

                                {/* Title */}
                                <h2 className="text-2xl font-bold mb-2">
                                    A Gift For You
                                </h2>

                                {/* Sender */}
                                <p className="text-muted-foreground mb-6">
                                    From <span className="text-primary font-mono bg-primary/5 px-2 py-0.5 rounded">{truncateAddress(sender)}</span>
                                </p>

                                {/* Message */}
                                {message && (
                                    <div className="w-full bg-muted/50 rounded-xl p-6 mb-8 text-left border border-border/50">
                                        <p className="text-sm font-medium text-muted-foreground mb-2">Personal Note</p>
                                        <p className="text-lg italic leading-relaxed text-foreground/90">"{message}"</p>
                                    </div>
                                )}

                                {/* Continue Button */}
                                <Button size="lg" className="w-full" onClick={onContinue}>
                                    ✨ Continue to Gift
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
