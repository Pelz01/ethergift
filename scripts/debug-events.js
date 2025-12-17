const { createPublicClient, http, parseAbiItem } = require('viem');
const { sepolia } = require('viem/chains');

// Config
const CONTRACT_ADDRESS = '0xB0d30C2722837b4536C7eAB66b5D8B740a0f543a'; // From .env.local
const EVENT_SIGNATURE = 'event GiftCreated(uint256 indexed tokenId, address indexed sender, address indexed recipient, uint256 amount, uint8 boxStyle)';

async function main() {
    console.log('Creating client...');
    const client = createPublicClient({
        chain: sepolia,
        transport: http()
    });

    const blockNumber = await client.getBlockNumber();
    console.log('Current Block:', blockNumber);
    const fromBlock = blockNumber - 100000n; // Look back ~2 weeks
    console.log(`Querying events from block ${fromBlock} to latest...`);

    try {
        const logs = await client.getLogs({
            address: CONTRACT_ADDRESS,
            event: parseAbiItem(EVENT_SIGNATURE),
            fromBlock: fromBlock
        });

        console.log(`\nFound ${logs.length} events!`);

        logs.forEach((log, index) => {
            console.log(`\n[Event ${index + 1}]`);
            console.log('Block:', log.blockNumber);
            console.log('Args:', JSON.stringify(log.args, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
                , 2));
        });

    } catch (error) {
        console.error('Error fetching logs:', error);
    }
}

main();
