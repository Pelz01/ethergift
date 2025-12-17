'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { pageVariants, staggerContainer, staggerItem } from '@/lib/animations';
import { Gift, ArrowRight, Shield, Sparkles, Clock, Send } from 'lucide-react';

export default function AboutPage() {
    const steps = [
        {
            number: '01',
            title: 'Connect Wallet',
            description: 'Link your Ethereum wallet using MetaMask, WalletConnect, or any supported provider.',
            icon: Shield,
        },
        {
            number: '02',
            title: 'Wrap Your Gift',
            description: 'Enter the recipient address, amount of ETH, and add a personal message.',
            icon: Gift,
        },
        {
            number: '03',
            title: 'Choose a Box Style',
            description: 'Select from Silver, Gold, or Obsidian gift boxes for an extra touch of luxury.',
            icon: Sparkles,
        },
        {
            number: '04',
            title: 'Send the Link',
            description: 'Share the unique gift link with your recipient via text, email, or social media.',
            icon: Send,
        },
        {
            number: '05',
            title: 'Recipient Unwraps',
            description: 'They connect their wallet and enjoy the immersive 3D unboxing experience!',
            icon: Clock,
        },
    ];

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            className="flex-1 py-16 px-4"
        >
            <div className="container max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="text-center mb-16"
                >
                    <motion.h1
                        variants={staggerItem}
                        className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
                    >
                        How <span className="text-primary">EtherGift</span> Works
                    </motion.h1>
                    <motion.p
                        variants={staggerItem}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        Send ETH as a memorable experience in just a few simple steps.
                    </motion.p>
                </motion.div>

                {/* Steps */}
                <div className="space-y-8 mb-16">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="overflow-hidden">
                                <div className="flex flex-col md:flex-row items-start gap-6 p-6">
                                    <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <step.icon className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-sm font-mono text-primary">{step.number}</span>
                                            <h3 className="text-xl font-semibold">{step.title}</h3>
                                        </div>
                                        <p className="text-muted-foreground">{step.description}</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <Card className="bg-primary text-primary-foreground border-none py-12">
                        <CardContent className="space-y-6">
                            <h2 className="text-2xl md:text-3xl font-bold">Ready to Send Your First Gift?</h2>
                            <p className="text-primary-foreground/80 max-w-md mx-auto">
                                It only takes a minute to wrap and send ETH in style.
                            </p>
                            <Link href="/create">
                                <Button size="lg" variant="secondary" className="h-12 px-8 rounded-full">
                                    Start Gifting
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
