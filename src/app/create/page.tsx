'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, isAddress } from 'viem';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { BoxStyleSelector } from '@/components/BoxStyleSelector';
import { GIFT_BOX_ABI, GIFT_BOX_ADDRESS, BoxStyle } from '@/lib/contract';
import { pageVariants } from '@/lib/animations';
import { GiftCardPreview, CardTemplate } from '@/components/GiftCardPreview';
import { ArrowRight, Copy, Check, Gift, AlertCircle, Loader2 } from 'lucide-react';

export default function CreateGiftPage() {
    const router = useRouter();
    const { isConnected, address } = useAccount();
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [boxStyle, setBoxStyle] = useState<BoxStyle>(BoxStyle.Gold);
    const [showSuccess, setShowSuccess] = useState(false);
    const [createdTokenId, setCreatedTokenId] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [copied, setCopied] = useState(false);

    const [cardTemplate, setCardTemplate] = useState<CardTemplate>('classic');

    const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    // Validate form
    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!recipient) {
            newErrors.recipient = 'Recipient address is required';
        } else if (!isAddress(recipient)) {
            newErrors.recipient = 'Invalid Ethereum address';
        } else if (recipient.toLowerCase() === address?.toLowerCase()) {
            newErrors.recipient = 'Cannot send gift to yourself';
        }

        if (!amount) {
            newErrors.amount = 'Amount is required';
        } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            writeContract({
                address: GIFT_BOX_ADDRESS,
                abi: GIFT_BOX_ABI,
                functionName: 'mint',
                args: [recipient as `0x${string}`, message, boxStyle],
                value: parseEther(amount),
            });
        } catch (err) {
            console.error('Transaction error:', err);
        }
    };

    // Watch for transaction success
    if (isSuccess && !showSuccess) {
        // For demo, we'll use a placeholder token ID
        // In production, extract from transaction logs
        setCreatedTokenId('0');
        setShowSuccess(true);
    }

    const giftUrl = createdTokenId
        ? `${typeof window !== 'undefined' ? window.location.origin : ''}/gift/${createdTokenId}`
        : '';

    const handleCopyIndex = () => {
        navigator.clipboard.writeText(giftUrl || 'https://ethergift.app/gift/0');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (showSuccess) {
        return (
            <div className="container max-w-lg mx-auto py-24 px-4">
                <Card className="border-primary/50 shadow-2xl">
                    <CardHeader className="text-center">
                        <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <Gift className="w-10 h-10 text-primary" />
                        </div>
                        <CardTitle className="text-3xl">Gift Wrapped!</CardTitle>
                        <CardDescription className="text-lg">
                            Your gift is ready. Share the link below with your recipient.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 bg-muted rounded-lg border border-border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-muted-foreground">Gift Link</span>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleCopyIndex}>
                                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                </Button>
                            </div>
                            <code className="text-sm font-mono break-all text-primary block">
                                {giftUrl || 'https://ethergift.app/gift/0'}
                            </code>
                        </div>

                        <div className="flex gap-4">
                            <Button className="flex-1" onClick={handleCopyIndex}>
                                {copied ? 'Copied!' : 'Copy Link'}
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={() => router.push('/')}>
                                Done
                            </Button>
                        </div>
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
            className="flex-1 py-12 px-4"
        >
            <div className="container max-w-6xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Wrap Your Gift</h1>
                    <p className="text-muted-foreground">
                        Customize your gift card and unwrapping experience.
                    </p>
                </div>

                {!isConnected ? (
                    <div className="max-w-xl mx-auto">
                        <Card className="text-center py-12">
                            <CardContent className="flex flex-col items-center gap-6">
                                <div className="p-4 rounded-full bg-muted">
                                    <AlertCircle className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold">Connect Wallet</h3>
                                    <p className="text-muted-foreground max-w-sm mx-auto">
                                        Please connect your wallet to mint a gift on the blockchain.
                                    </p>
                                </div>
                                <ConnectButton />
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* LEFT COLUMN: FORM */}
                        <Card className="order-2 lg:order-1">
                            <form onSubmit={handleSubmit}>
                                <CardContent className="space-y-6 pt-6">
                                    {/* Recipient */}
                                    <Input
                                        label="Recipient Address"
                                        placeholder="0x... or ENS name"
                                        value={recipient}
                                        onChange={(e) => setRecipient(e.target.value)}
                                        error={errors.recipient}
                                    />

                                    {/* Amount */}
                                    <Input
                                        label="Amount"
                                        type="number"
                                        step="0.001"
                                        min="0"
                                        placeholder="0.1"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        error={errors.amount}
                                        suffix="ETH"
                                    />

                                    {/* Card Template Selector */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Card Design</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { id: 'classic', label: 'Classic' },
                                                { id: 'ribbon', label: 'Ribbon' },
                                                { id: 'bow', label: 'Bow' }
                                            ].map((style) => (
                                                <button
                                                    key={style.id}
                                                    type="button"
                                                    onClick={() => setCardTemplate(style.id as CardTemplate)}
                                                    className={`
                                                        p-3 rounded-lg border-2 text-sm font-medium transition-all
                                                        ${cardTemplate === style.id
                                                            ? 'border-primary bg-primary/5 text-primary'
                                                            : 'border-muted bg-muted/50 hover:border-primary/50 text-muted-foreground'}
                                                    `}
                                                >
                                                    {style.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Personal Message */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Personal Note (Optional)
                                        </label>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Happy Birthday, fren! 🎉"
                                            maxLength={280}
                                            rows={3}
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-None"
                                        />
                                        <p className="text-xs text-muted-foreground text-right">{message.length}/280</p>
                                    </div>

                                    {/* Box Style */}
                                    <BoxStyleSelector selected={boxStyle} onSelect={setBoxStyle} />

                                    {/* Error Message */}
                                    {writeError && (
                                        <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            {writeError.message.includes('user rejected')
                                                ? 'Transaction was rejected'
                                                : 'Transaction failed. Please try again.'}
                                        </div>
                                    )}
                                </CardContent>

                                <CardFooter className="flex-col gap-4">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full"
                                        disabled={isPending || isConfirming}
                                    >
                                        {isPending || isConfirming ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                {isPending ? 'Confirm in Wallet...' : 'Wrapping Gift...'}
                                            </>
                                        ) : (
                                            <>
                                                <Gift className="mr-2 h-4 w-4" />
                                                Wrap Gift
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-center text-xs text-muted-foreground">
                                        The gift will be minted as an NFT to the recipient.
                                    </p>
                                </CardFooter>
                            </form>
                        </Card>

                        {/* RIGHT COLUMN: PREVIEW */}
                        <div className="order-1 lg:order-2 lg:sticky lg:top-24 space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <h2 className="text-lg font-semibold">Live Preview</h2>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Card View</span>
                            </div>
                            <GiftCardPreview
                                template={cardTemplate}
                                amount={amount}
                                recipient={recipient}
                                message={message}
                                className="w-full shadow-xl"
                            />
                            <p className="text-sm text-muted-foreground text-center">
                                This is how your gift card will appear to the recipient.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
