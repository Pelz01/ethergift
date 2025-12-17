'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount, usePublicClient } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { GiftCardPreview, CardTemplate } from '@/components/GiftCardPreview';
import { GIFT_BOX_ABI, GIFT_BOX_ADDRESS, BoxStyle, formatEth } from '@/lib/contract';
import { pageVariants, staggerContainer, staggerItem } from '@/lib/animations';
import { Gift, ArrowRight, Loader2, Inbox, Send, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface GiftEvent {
    tokenId: bigint;
    sender: string;
    recipient: string;
    amount: bigint;
    boxStyle: BoxStyle;
    message?: string; // We might need to fetch this separately
    timestamp?: number;
    claimed?: boolean;
}

export default function DashboardPage() {
    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
    const [gifts, setGifts] = useState<GiftEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch gifts on mount or address change
    useEffect(() => {
        if (!address || !publicClient) return;

        const fetchGifts = async () => {
            setIsLoading(true);
            try {
                // Fetch GiftCreated logs
                const logs = await publicClient.getContractEvents({
                    address: GIFT_BOX_ADDRESS,
                    abi: GIFT_BOX_ABI,
                    eventName: 'GiftCreated',
                    fromBlock: 0n, // Ideally would be deployment block
                    args: activeTab === 'received' ? { recipient: address } : { sender: address },
                });

                // Fetch current status for each gift
                const giftPromises = logs.map(async (log) => {
                    const { tokenId, sender, recipient, amount, boxStyle } = log.args;

                    if (tokenId === undefined) return null;

                    // Fetch current details to check if claimed and get message
                    try {
                        const details = await publicClient.readContract({
                            address: GIFT_BOX_ADDRESS,
                            abi: GIFT_BOX_ABI,
                            functionName: 'getGift',
                            args: [tokenId],
                        });

                        // [sender, amount, message, boxStyle, createdAt, claimed, currentOwner]
                        // Note: ABI returns struct/tuple, wagmi returns array or object depending on config.
                        // Based on ABI, it returns named values.

                        return {
                            tokenId,
                            sender: sender!,
                            recipient: recipient!,
                            amount: amount!,
                            boxStyle: boxStyle!,
                            message: details[2],
                            timestamp: Number(details[4]),
                            claimed: details[5],
                        } as GiftEvent;

                    } catch (e) {
                        console.error(`Error fetching details for token ${tokenId}`, e);
                        return null;
                    }
                });

                const results = await Promise.all(giftPromises);
                const validGifts = results.filter((g): g is GiftEvent => g !== null);

                // Sort by newest first
                setGifts(validGifts.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)));

            } catch (error) {
                console.error('Error fetching gifts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGifts();
    }, [address, activeTab, publicClient]);

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            className="flex-1 py-12 px-4"
        >
            <div className="container max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Gift Dashboard</h1>
                        <p className="text-muted-foreground">
                            Manage your sent and received gifts.
                        </p>
                    </div>
                    <Link href="/create">
                        <Button>
                            <Gift className="mr-2 w-4 h-4" />
                            Wrap New Gift
                        </Button>
                    </Link>
                </div>

                {!isConnected ? (
                    <Card className="text-center py-12 max-w-md mx-auto">
                        <CardContent className="flex flex-col items-center gap-6">
                            <div className="p-4 rounded-full bg-muted">
                                <AlertCircle className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold">Connect Wallet</h3>
                                <p className="text-muted-foreground">
                                    Connect your wallet to view your gift history.
                                </p>
                            </div>
                            <ConnectButton />
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Tabs */}
                        <div className="flex items-center gap-4 border-b mb-8">
                            <button
                                onClick={() => setActiveTab('received')}
                                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${activeTab === 'received'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <Inbox className="w-4 h-4" />
                                Received Gifts
                            </button>
                            <button
                                onClick={() => setActiveTab('sent')}
                                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${activeTab === 'sent'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <Send className="w-4 h-4" />
                                Sent Gifts
                            </button>
                        </div>

                        {/* Content */}
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                                <p>Loading your gifts...</p>
                            </div>
                        ) : gifts.length === 0 ? (
                            <Card className="text-center py-16 bg-muted/20 border-dashed">
                                <CardContent className="flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                        <Gift className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-semibold">
                                            {activeTab === 'received' ? 'No gifts found' : 'No gifts sent yet'}
                                        </h3>
                                        <p className="text-muted-foreground max-w-xs mx-auto">
                                            {activeTab === 'received'
                                                ? "You haven't received any gifts yet. Tell your friends!"
                                                : "You haven't sent any gifts yet. Start spreading joy!"}
                                        </p>
                                    </div>
                                    {activeTab === 'sent' && (
                                        <Link href="/create">
                                            <Button variant="outline" className="mt-4">
                                                Send Your First Gift
                                            </Button>
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <motion.div
                                variants={staggerContainer}
                                initial="initial"
                                animate="animate"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {gifts.map((gift) => (
                                    <motion.div key={gift.tokenId.toString()} variants={staggerItem}>
                                        <div className="group relative">
                                            {/* We render a scaled-down preview card */}
                                            <div className="transform transition-transform duration-300 group-hover:-translate-y-1 hover:z-10 bg-white dark:bg-slate-900 rounded-xl shadow-lg border overflow-hidden">
                                                <div className="relative aspect-[1.586] overflow-hidden">
                                                    {/* Use a simplified view or the full preview component but scaled? 
                                                         Let's use the full component but handle responsiveness.
                                                         Pass a specific 'dashboard' style via className if needed. 
                                                     */}
                                                    <div className="absolute inset-0 transform scale-[0.6] origin-top-left w-[166.6%] h-[166.6%] pointer-events-none">
                                                        <GiftCardPreview
                                                            template={
                                                                gift.boxStyle === BoxStyle.Gold ? 'classic' :
                                                                    gift.boxStyle === BoxStyle.Obsidian ? 'bow' : 'ribbon'
                                                            }
                                                            amount={formatEth(gift.amount).replace(' ETH', '')}
                                                            recipient={gift.recipient}
                                                            message={gift.message || ''}
                                                        />
                                                    </div>

                                                    {/* Overlay for status */}
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />

                                                    {gift.claimed && (
                                                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur text-white text-xs font-bold uppercase rounded tracking-wider">
                                                            CLAIMED
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-4 border-t bg-background">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-mono text-xs text-muted-foreground">
                                                            #{gift.tokenId.toString()}
                                                        </span>
                                                        <span className="text-sm font-bold text-primary">
                                                            {formatEth(gift.amount)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date((gift.timestamp || 0) * 1000).toLocaleDateString()}
                                                        </span>
                                                        <Link href={`/gift/${gift.tokenId}`}>
                                                            <Button size="sm" variant="secondary" className="h-7 text-xs">
                                                                View Details
                                                                <ArrowRight className="ml-1 w-3 h-3" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </motion.div>
    );
}
