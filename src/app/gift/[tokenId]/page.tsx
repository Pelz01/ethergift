'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { UnwrapButton } from '@/components/UnwrapButton';
import { NoteModal } from '@/components/NoteModal';
import { ETHReveal } from '@/components/ETHReveal';
import { GIFT_BOX_ABI, GIFT_BOX_ADDRESS, BoxStyle, truncateAddress, formatEth } from '@/lib/contract';
import { pageVariants } from '@/lib/animations';
import { Lock, Search, Plus, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dynamic import for 3D component to avoid SSR issues
const GiftBox3D = dynamic(
    () => import('@/components/3d/GiftBox3D').then((mod) => mod.GiftBox3D),
    { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center"><div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div> }
);

// Demo data for when contract isn't deployed
const DEMO_GIFT = {
    sender: '0x742d35Cc6634C0532925a3b844Bc9e7595f8fE0a' as `0x${string}`,
    amount: BigInt('100000000000000000'), // 0.1 ETH
    message: 'Happy Birthday, fren! 🎉 Hope this makes your day special.',
    boxStyle: BoxStyle.Gold,
    createdAt: BigInt(Date.now() / 1000),
    claimed: false,
    currentOwner: '0x0000000000000000000000000000000000000000' as `0x${string}`,
};

interface GiftPageProps {
    params: { tokenId: string };
}

export default function GiftPage({ params }: GiftPageProps) {
    const tokenId = params.tokenId;
    const { isConnected, address } = useAccount();

    // UI States
    const [showNoteModal, setShowNoteModal] = useState(true);
    const [isShaking, setIsShaking] = useState(false);
    const [isExploding, setIsExploding] = useState(false);
    const [showReveal, setShowReveal] = useState(false);
    const [useDemo, setUseDemo] = useState(true); // Default to demo mode

    // Contract reads - disabled when using demo
    const { data: giftData, isLoading, error: readError } = useReadContract({
        address: GIFT_BOX_ADDRESS,
        abi: GIFT_BOX_ABI,
        functionName: 'getGift',
        args: [BigInt(tokenId || '0')],
        query: {
            enabled: GIFT_BOX_ADDRESS !== '0x0000000000000000000000000000000000000000',
        },
    });

    // Use demo data if contract call fails
    useEffect(() => {
        if (readError || GIFT_BOX_ADDRESS === '0x0000000000000000000000000000000000000000') {
            setUseDemo(true);
        }
    }, [readError]);

    // Parse gift data
    const gift = useDemo ? DEMO_GIFT : giftData ? {
        sender: giftData[0],
        amount: giftData[1],
        message: giftData[2],
        boxStyle: giftData[3] as BoxStyle,
        createdAt: giftData[4],
        claimed: giftData[5],
        currentOwner: giftData[6],
    } : null;

    // Contract writes
    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    // Handle successful claim
    useEffect(() => {
        if (isSuccess || (useDemo && isExploding)) {
            // Wait for explosion animation
            const timer = setTimeout(() => {
                setShowReveal(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, isExploding, useDemo]);

    // Check ownership
    const isOwner = useDemo
        ? isConnected // In demo mode, any connected wallet is the owner
        : gift && address && gift.currentOwner.toLowerCase() === address.toLowerCase();

    const isClaimed = gift?.claimed || false;

    // Handle unwrap
    const handleUnwrap = async () => {
        setIsShaking(true);

        // Shake for a moment then trigger transaction
        setTimeout(() => {
            if (useDemo) {
                // Demo mode - just animate
                setIsExploding(true);
                setIsShaking(false);
            } else {
                writeContract({
                    address: GIFT_BOX_ADDRESS,
                    abi: GIFT_BOX_ABI,
                    functionName: 'withdraw',
                    args: [BigInt(tokenId)],
                });
            }
        }, 500);
    };

    // Watch for transaction confirmation
    useEffect(() => {
        if (isSuccess) {
            setIsShaking(false);
            setIsExploding(true);
        }
    }, [isSuccess]);

    // Loading state
    if (isLoading && !useDemo) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="text-muted-foreground">Loading gift...</p>
                </div>
            </div>
        );
    }

    // Not found state
    if (!gift && !useDemo) {
        return (
            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center py-12">
                    <CardContent className="flex flex-col items-center gap-6">
                        <div className="p-4 rounded-full bg-muted">
                            <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold">Gift Not Found</h1>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                This gift doesn't exist or may have already been claimed.
                            </p>
                        </div>
                        <Link href="/">
                            <Button>Back to Home</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            className="flex-1 flex flex-col relative overflow-hidden"
        >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
                {/* Already Claimed State */}
                {isClaimed && (
                    <Card className="border-green-500/20 max-w-md w-full text-center py-8">
                        <CardContent className="space-y-6">
                            <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                                <Plus className="w-8 h-8 rotate-45" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold mb-2">Gift Already Claimed</h1>
                                <p className="text-muted-foreground">
                                    This gift has already been unwrapped.
                                </p>
                            </div>
                            <Link href="/create">
                                <Button className="w-full">Create Your Own Gift</Button>
                            </Link>
                            <Link href="/">
                                <Button variant="ghost" className="w-full">Back to Home</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Active Gift */}
                {!isClaimed && !showReveal && (
                    <div className="w-full max-w-4xl flex flex-col items-center">
                        {/* 3D Gift Box */}
                        <div className="w-full max-w-lg h-[400px] mb-8 relative">
                            <GiftBox3D
                                boxStyle={gift?.boxStyle || BoxStyle.Gold}
                                isShaking={isShaking}
                                isExploding={isExploding}
                            />
                        </div>

                        {/* Gift Info */}
                        <AnimatePresence>
                            {!isExploding && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="text-center mb-8 space-y-2 bg-background/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 shadow-sm"
                                >
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Gift from <span className="text-primary font-mono">{truncateAddress(gift?.sender || '')}</span>
                                    </p>
                                    <p className="text-2xl font-bold">
                                        Contains <span className="text-primary">{formatEth(gift?.amount || BigInt(0))} ETH</span>
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Connection/Claim Actions */}
                        <div className="w-full max-w-md">
                            {!isConnected && !isExploding && (
                                <Card className="text-center border-dashed">
                                    <CardContent className="pt-6 space-y-4">
                                        <p className="text-muted-foreground">Connect your wallet to unwrap this gift</p>
                                        <div className="flex justify-center">
                                            <ConnectButton />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {isConnected && !isOwner && !useDemo && !isExploding && (
                                <Card className="border-destructive/20 text-center">
                                    <CardContent className="pt-6 space-y-4">
                                        <div className="w-12 h-12 mx-auto bg-destructive/10 rounded-full flex items-center justify-center text-destructive">
                                            <Lock className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-semibold text-lg">Not Your Gift</h3>
                                        <p className="text-sm text-muted-foreground">
                                            This gift belongs to{' '}
                                            <span className="font-mono text-foreground font-medium">{truncateAddress(gift?.currentOwner || '')}</span>.
                                            Please switch to the correct wallet.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Unwrap Button */}
                            {isConnected && (isOwner || useDemo) && !isExploding && (
                                <div className="flex justify-center">
                                    <UnwrapButton
                                        onComplete={handleUnwrap}
                                        loading={isPending || isConfirming}
                                        disabled={isPending || isConfirming}
                                    />
                                </div>
                            )}

                            {/* Transaction Status */}
                            {(isPending || isConfirming) && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center text-muted-foreground mt-4 text-sm animate-pulse"
                                >
                                    {isPending ? 'Confirm in your wallet...' : 'Unwrapping gift...'}
                                </motion.p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Note Modal */}
            <NoteModal
                isOpen={showNoteModal && !isClaimed && !!gift}
                sender={gift?.sender || ''}
                message={gift?.message || ''}
                onContinue={() => setShowNoteModal(false)}
            />

            {/* ETH Reveal */}
            <ETHReveal amount={gift?.amount || BigInt(0)} visible={showReveal} />
        </motion.div>
    );
}
