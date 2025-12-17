'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
    value: string;
    trigger: React.ReactNode;
    children: React.ReactNode;
    isOpen?: boolean;
    onClick?: () => void;
}

export function Accordion({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("space-y-4", className)}>{children}</div>;
}

export function AccordionItem({ value, trigger, children }: Omit<AccordionItemProps, 'isOpen' | 'onClick'>) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="border rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm transition-all duration-200 hover:border-primary/20">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-4 text-left font-medium transition-colors hover:text-primary"
            >
                {trigger}
                <ChevronDown
                    className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform duration-200",
                        isOpen && "transform rotate-180 text-primary"
                    )}
                />
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <div className="px-4 pb-4 text-muted-foreground border-t border-border/50 pt-4">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
