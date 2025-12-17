# EtherGift 🎁

> **Send Value, Not Just Hashes.**

A decentralized gifting protocol that transforms sending ETH into an immersive unboxing experience. Built on Ethereum Sepolia testnet.

![EtherGift](https://img.shields.io/badge/Network-Sepolia-blue?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=flat-square)

## ✨ Features

- **🎁 Gift Wrapping** - Wrap ETH in a premium digital gift box
- **🔒 Secure Escrow** - ETH locked in smart contract until claimed
- **🎨 Box Styles** - Choose from Silver, Gold, or Obsidian designs
- **📤 Transferable** - Recipients can forward gifts to others
- **🎬 3D Experience** - Immersive unboxing with React Three Fiber
- **💌 Personal Notes** - Attach a message to your gift
- **🔄 Recall Feature** - Senders can reclaim unclaimed gifts

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or another Web3 wallet
- Some Sepolia ETH ([Faucet](https://sepoliafaucet.com))

### Installation

```bash
# Navigate to the project
cd ethergift

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

Create a `.env.local` file in the `ethergift` directory:

```env
# WalletConnect Project ID (get one at https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# GiftBox Contract Address (Sepolia)
NEXT_PUBLIC_CONTRACT_ADDRESS=0xB0d30C2722837b4536C7eAB66b5D8B740a0f543a
```

## 📁 Project Structure

```
ethergift/
├── contracts/              # Solidity smart contract
│   └── GiftBox.sol        # ERC-721 escrow vault
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── page.tsx       # Landing page
│   │   ├── create/        # Gift creation flow
│   │   └── gift/[tokenId] # Gift unwrapping experience
│   ├── components/
│   │   ├── 3d/            # React Three Fiber components
│   │   ├── ui/            # Reusable UI components
│   │   └── ...            # Feature components
│   └── lib/               # Utilities and config
├── public/                # Static assets
└── package.json
```

## 🛠️ Smart Contract

The `GiftBox.sol` contract implements:

### Core Functions

| Function | Description |
|----------|-------------|
| `mint(recipient, message, boxStyle)` | Create a gift (payable) |
| `withdraw(tokenId)` | Claim a gift (burns NFT, sends ETH) |
| `recall(tokenId)` | Reclaim unclaimed gift (sender only) |
| `getGift(tokenId)` | View gift details |

### Security

- ERC-721 compliant (transferable NFTs)
- ReentrancyGuard on all state-changing functions
- Custom errors for gas efficiency
- Events for all actions

### Deployment

Contract is deployed on **Sepolia** at: `0xB0d30C2722837b4536C7eAB66b5D8B740a0f543a`

To deploy your own:

1. Open [Remix IDE](https://remix.ethereum.org)
2. Create a new file and paste `contracts/GiftBox.sol`
3. Compile with Solidity 0.8.20
4. Deploy to Sepolia via Injected Provider (MetaMask)
5. Copy the deployed address to your `.env.local`

## 🎨 User Flows

### Sender Flow ("The Wrapper")

1. Connect wallet on landing page
2. Click "Wrap a Gift"
3. Enter recipient address, amount, and note
4. Choose box style (Silver, Gold, Obsidian)
5. Confirm transaction
6. Share the generated gift link

### Receiver Flow ("The Unwrapper")

1. Open the gift link
2. See personal note from sender
3. Connect wallet (must be the gift owner)
4. Hold the "UNWRAP" button
5. Watch the 3D unboxing animation
6. ETH is transferred to your wallet!

## 🎯 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19 |
| Styling | Tailwind CSS v4 |
| Web3 | Wagmi, Viem, RainbowKit |
| 3D | React Three Fiber, Three.js |
| Animation | Framer Motion |
| Contract | Solidity 0.8.20 |

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Type check
npx tsc --noEmit
```

## 📄 License

MIT License - feel free to use this for your own projects!

---

Built with ❤️ for the Ethereum community
