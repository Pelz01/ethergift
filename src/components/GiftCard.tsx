'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BoxStyle, formatEth, truncateAddress } from '@/lib/contract';
import { Gift, ArrowRight, RotateCcw } from 'lucide-react';
import Link from 'next/link';

interface GiftCardProps {
    tokenId: string;
    amount: bigint;
    sender: string;
    recipient?: string;
    boxStyle: BoxStyle;
    claimed: boolean;
    isReceived: boolean; // true if looking at received gifts, false if sent
    onRecall?: (tokenId: string) => void;
    canRecall?: boolean;
}

export function GiftCard({
    tokenId,
    amount,
    sender,
    recipient,
    boxStyle,
    claimed,
    isReceived,
    onRecall,
    canRecall
}: GiftCardProps) {

    // Helper to get box color
    const getBoxColor = (style: BoxStyle) => {
        switch (Number(style)) {
            case BoxStyle.Silver: return "bg-slate-300 text-slate-800";
            case BoxStyle.Gold: return "bg-amber-400 text-amber-900";
            case BoxStyle.Obsidian: return "bg-slate-900 text-slate-100";
            default: return "bg-primary text-primary-foreground";
        }
    };

    const boxColor = getBoxColor(boxStyle);

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className={`h-24 ${boxColor} flex items-center justify-center relative`}>
                <Gift className="w-10 h-10 opacity-80" />
                {claimed && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                        <span className="font-bold text-sm px-3 py-1 bg-background/80 rounded-full border shadow-sm">
                            CLAIMED
                        </span>
                    </div>
                )}
            </div>

            <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-start">
                    <span>{formatEth(amount)} ETH</span>
                    <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded">
                        #{tokenId}
                    </span>
                </CardTitle>
            </CardHeader>

            <CardContent className="text-sm space-y-1 pb-4">
                {isReceived ? (
                    <p className="text-muted-foreground">
                        From: <span className="font-medium text-foreground">{truncateAddress(sender)}</span>
                    </p>
                ) : (
                    <p className="text-muted-foreground">
                        To: <span className="font-medium text-foreground">{truncateAddress(recipient || '')}</span>
                    </p>
                )}
            </CardContent>

            <CardFooter className="pt-0">
                {isReceived ? (
                    !claimed ? (
                        <Link href={`/gift/${tokenId}`} className="w-full">
                            <Button className="w-full gap-2">
                                <Gift className="w-4 h-4" />
                                Unwrap Gift
                            </Button>
                        </Link>
                    ) : (
                        <Button variant="outline" disabled className="w-full">
                            Unwrapped
                        </Button>
                    )
                ) : (
                    // Sent View
                    !claimed ? (
                        canRecall && onRecall ? (
                            <Button
                                variant="destructive"
                                size="sm"
                                className="w-full gap-2"
                                onClick={() => onRecall(tokenId)}
                            >
                                <RotateCcw className="w-4 h-4" />
                                Recall Gift
                            </Button>
                        ) : (
                            <Link href={`/gift/${tokenId}`} className="w-full">
                                <Button variant="outline" size="sm" className="w-full">
                                    View Status
                                </Button>
                            </Link>
                        )
                    ) : (
                        <Button variant="ghost" disabled className="w-full text-muted-foreground">
                            Recipient claimed
                        </Button>
                    )
                )}
            </CardFooter>
        </Card>
    );
}
