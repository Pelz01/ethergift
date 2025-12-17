'use client';

import { motion } from 'framer-motion';
import { BoxStyle, BOX_STYLES } from '@/lib/contract';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface BoxStyleSelectorProps {
    selected: BoxStyle;
    onSelect: (style: BoxStyle) => void;
}

export function BoxStyleSelector({ selected, onSelect }: BoxStyleSelectorProps) {
    const styles = [BoxStyle.Silver, BoxStyle.Gold, BoxStyle.Obsidian];

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Choose Box Style
            </label>
            <div className="grid grid-cols-3 gap-4">
                {styles.map((style) => {
                    const meta = BOX_STYLES[style];
                    const isSelected = selected === style;

                    return (
                        <motion.button
                            key={style}
                            type="button"
                            onClick={() => onSelect(style)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                                "relative p-4 rounded-xl border-2 transition-all duration-300 text-left hover:border-primary/50",
                                isSelected ? "border-primary bg-primary/5" : "border-muted bg-card"
                            )}
                        >
                            {/* Box Preview */}
                            <div
                                className="w-16 h-16 mx-auto rounded-lg mb-3 shadow-md"
                                style={{ background: meta.gradient }}
                            />

                            {/* Label */}
                            <div className="text-center">
                                <div className="font-semibold text-sm">{meta.name}</div>
                                <div className="text-xs text-muted-foreground mt-1">{meta.description}</div>
                            </div>

                            {/* Selected Indicator */}
                            {isSelected && (
                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                    <Check className="w-3 h-3 text-primary-foreground" />
                                </div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
