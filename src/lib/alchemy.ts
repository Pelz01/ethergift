
export interface AlchemyTransfer {
    blockNum: string;
    uniqueId: string;
    hash: string;
    from: string;
    to: string;
    value: number | null;
    erc721TokenId: string | null;
    erc1155Metadata: string | null;
    tokenId: string | null;
    asset: string | null;
    category: string;
    rawContract: {
        value: string | null;
        address: string | null;
        decimal: string | null;
    };
}

interface AlchemyResponse {
    jsonrpc: string;
    id: number;
    result: {
        transfers: AlchemyTransfer[];
    };
}

/**
 * Fetches transaction history for the GiftBox contract using Alchemy's RPC.
 * 
 * @param userAddress - The address of the user (sender or receiver)
 * @param type - 'sent' to see ETH deposits, 'received' to see NFT transfers
 * @returns List of transfers
 */
export async function fetchContractHistory(
    userAddress: string,
    type: 'sent' | 'received'
): Promise<AlchemyTransfer[]> {
    const rpcUrl = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL;
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

    if (!rpcUrl || !contractAddress) {
        console.error("Missing RPC URL or Contract Address");
        return [];
    }

    const isSent = type === 'sent';

    // Construct the params based on type
    const params = isSent
        ? {
            // SENDER: "I sent ETH to the Contract"
            fromBlock: "0x0",
            fromAddress: userAddress,
            toAddress: contractAddress,
            category: ["external"], // ETH transfers
            excludeZeroValue: true
        }
        : {
            // RECEIVER: "I received an NFT from the Contract"
            fromBlock: "0x0",
            toAddress: userAddress,
            contractAddresses: [contractAddress], // Only show GiftBoxes
            category: ["erc721"], // NFT transfers
            excludeZeroValue: false
        };

    const body = {
        jsonrpc: "2.0",
        id: isSent ? 1 : 2,
        method: "alchemy_getAssetTransfers",
        params: [params]
    };

    try {
        const response = await fetch(rpcUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`RPC request failed: ${response.statusText}`);
        }

        const data: AlchemyResponse = await response.json();
        return data.result.transfers;

    } catch (error) {
        console.error("Error fetching history from Alchemy:", error);
        return [];
    }
}
