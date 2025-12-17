// GiftBox Contract ABI - Core functions only
export const GIFT_BOX_ABI = [
    // Read functions
    {
        inputs: [{ name: 'tokenId', type: 'uint256' }],
        name: 'getGift',
        outputs: [
            { name: 'sender', type: 'address' },
            { name: 'amount', type: 'uint256' },
            { name: 'message', type: 'string' },
            { name: 'boxStyle', type: 'uint8' },
            { name: 'createdAt', type: 'uint256' },
            { name: 'claimed', type: 'bool' },
            { name: 'currentOwner', type: 'address' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'tokenId', type: 'uint256' }],
        name: 'ownerOf',
        outputs: [{ name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'nextTokenId',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    // Write functions
    {
        inputs: [
            { name: 'recipient', type: 'address' },
            { name: 'message', type: 'string' },
            { name: 'boxStyle', type: 'uint8' },
        ],
        name: 'mint',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [{ name: 'tokenId', type: 'uint256' }],
        name: 'withdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ name: 'tokenId', type: 'uint256' }],
        name: 'recall',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    // Transfer
    {
        inputs: [
            { name: 'from', type: 'address' },
            { name: 'to', type: 'address' },
            { name: 'tokenId', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    // Events
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'tokenId', type: 'uint256' },
            { indexed: true, name: 'sender', type: 'address' },
            { indexed: true, name: 'recipient', type: 'address' },
            { indexed: false, name: 'amount', type: 'uint256' },
            { indexed: false, name: 'boxStyle', type: 'uint8' },
        ],
        name: 'GiftCreated',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'tokenId', type: 'uint256' },
            { indexed: true, name: 'claimer', type: 'address' },
            { indexed: false, name: 'amount', type: 'uint256' },
        ],
        name: 'GiftClaimed',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'tokenId', type: 'uint256' },
            { indexed: true, name: 'sender', type: 'address' },
            { indexed: false, name: 'amount', type: 'uint256' },
        ],
        name: 'GiftRecalled',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'from', type: 'address' },
            { indexed: true, name: 'to', type: 'address' },
            { indexed: true, name: 'tokenId', type: 'uint256' },
        ],
        name: 'Transfer',
        type: 'event',
    },
] as const;

// Contract address - will be updated after deployment
export const GIFT_BOX_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';

// Box style enum matching contract
export enum BoxStyle {
    Silver = 0,
    Gold = 1,
    Obsidian = 2,
}

// Box style metadata
export const BOX_STYLES = {
    [BoxStyle.Silver]: {
        name: 'Silver',
        description: 'Elegant and timeless',
        gradient: 'linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 50%, #A8A8A8 100%)',
        color: '#C0C0C0',
        emissive: '#888888',
    },
    [BoxStyle.Gold]: {
        name: 'Gold',
        description: 'Prestigious and luxurious',
        gradient: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 50%, #B8860B 100%)',
        color: '#D4AF37',
        emissive: '#8B7500',
    },
    [BoxStyle.Obsidian]: {
        name: 'Obsidian',
        description: 'Mysterious and exclusive',
        gradient: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 50%, #0F0F1A 100%)',
        color: '#1A1A2E',
        emissive: '#4A4A6A',
    },
} as const;

// Gift interface matching contract struct
export interface Gift {
    sender: `0x${string}`;
    amount: bigint;
    message: string;
    boxStyle: BoxStyle;
    createdAt: bigint;
    claimed: boolean;
    currentOwner: `0x${string}`;
}

// Helper to format ETH amount
export function formatEth(wei: bigint): string {
    const eth = Number(wei) / 1e18;
    return eth.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
    });
}

// Helper to truncate address
export function truncateAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
