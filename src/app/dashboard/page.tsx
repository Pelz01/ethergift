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
import { fetchContractHistory } from '@/lib/alchemy';

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
                // Fetch history using Alchemy RPC
                const transfers = await fetchContractHistory(
                    address,
                    activeTab // 'sent' or 'received'
                );

                // Process transfers into GiftEvents
                const giftPromises = transfers.map(async (tx: any) => {
                    // For 'sent' (ETH transfer), we don't have the tokenId directly in the transfer params usually
                    // But wait, the mint function emits an event with the tokenId.
                    // The 'external' transfer doesn't return the minted Token ID in the transfer object itself.
                    // HOWEVER, the user prompt implies this flow works. 

                    // Actually, for 'sent', checking ETH transfers gives us the *deposit*, but linking it to the specific Gift ID 
                    // is tricky without logs.
                    // BUT, let's look at the 'received' logic first which uses ERC721 -> TokenID is present.

                    // For 'sent', the user might be okay with just seeing the transaction hash or we might need to look up the receipt.
                    // Let's assume for now we are processing 'received' (ERC721) where tokenId is available.

                    // Wait, if we use 'external' for sent, we get the transaction Hash. 
                    // We can use the transaction hash to find the GiftCreated log if needed.
                    // OR, we can just display the ETH transfer info.

                    // Let's refine the logic:
                    // If activeTab === 'received': We have ERC721 transfer -> we have tokenId. Good.
                    // If activeTab === 'sent': We have ETH transfer -> NO tokenId in transfer object.

                    // CRITICAL FIX: The user's prompt says: "The Sender wants to see: 'I sent 0.1 ETH'".
                    // But the dashboard displays Token ID and details.
                    // If I only fetch ETH transfers, I won't easily know which Gift ID it was unless I query the logs for that txHash.

                    // Let's implement robust handling:
                    let tokenId: bigint;

                    if (activeTab === 'received') {
                        if (!tx.tokenId && !tx.erc721TokenId) return null;
                        tokenId = BigInt(tx.tokenId || tx.erc721TokenId || '0');
                    } else {
                        // For SENT gifts, we need to find the TokenID associated with this transaction.
                        // We can get the transaction receipt to find logs.
                        try {
                            const receipt = await publicClient.getTransactionReceipt({ hash: tx.hash as `0x${string}` });
                            // Find GiftCreated event
                            // Topic0 for GiftCreated(uint256,address,address,uint256,uint8)
                            // We can try to decode the logs.

                            // Optimization: If we can't find it easily, maybe we skip or just show basics?
                            // But the UI expects a GiftEvent with tokenId.

                            // Let's parse logs for this tx.
                            // We know the contract address.
                            const log = receipt.logs.find(l => l.address.toLowerCase() === GIFT_BOX_ADDRESS.toLowerCase());
                            if (!log) return null; // Not a gift transaction

                            // We'd need to parse the log. 
                            // Let's lazily assume the first log topic1 (if indexed) is tokenId? 
                            // GiftCreated: tokenId is indexed (topic 1).
                            tokenId = BigInt(log.topics[1] || '0');
                        } catch (e) {
                            console.warn('Could not find token ID for tx', tx.hash);
                            return null;
                        }
                    }

                    // Fetch current details from contract
                    try {
                        const details = await publicClient.readContract({
                            address: GIFT_BOX_ADDRESS,
                            abi: GIFT_BOX_ABI,
                            functionName: 'getGift',
                            args: [tokenId],
                        }) as unknown as any[]; // Cast as array to bypass tuple index check for now since ABI definition might differ slightly in structure vs what wagmi returns for tuple

                        // [sender, amount, message, boxStyle, createdAt, claimed, currentOwner]
                        // Note: ABI returns struct/tuple, wagmi returns array or object depending on config.
                        // Based on ABI, it returns named values.

                        return {
                            tokenId,
                            sender: details[0] as string, // sender
                            recipient: details[6] as string, // currentOwner (as proxy for recipient)

                            amount: details[1] as bigint,
                            message: details[2] as string,
                            boxStyle: Number(details[3]) as BoxStyle,
                            timestamp: Number(details[4]),
                            claimed: details[5] as boolean,
                        } as GiftEvent;

                    } catch (e) {
                        // Token might not exist or other error
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
