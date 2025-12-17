# EtherGift: Project Development & Technical Report

**Date:** December 17, 2025
**Project:** EtherGift (Next.js dApp)
**Version:** 0.1.0

---

## 1. Project Overview
EtherGift is a decentralized application (dApp) designed to transform the experience of sending cryptocurrency into a delightful gifting moment. Unlike standard wallet transfers, EtherGift wraps ETH in a virtual, interactive 3D gift box, allowing senders to attach personal messages and choose custom box styles (e.g., Gold, Obsidian, Ribbon). The recipient enjoys a unique "unwrapping" experience before claiming the funds.

## 2. Technical Architecture
The application is built on a modern, robust stack designed for performance, security, and user experience:

*   **Frontend Framework:** Next.js 16 (App Router) for server-side rendering and optimized routing.
*   **Language:** TypeScript (ES2020) for strict type safety and reliable code.
*   **Blockchain Integration:**
    *   **Wagmi & Viem:** Lightweight, composable hooks for Ethereum interaction.
    *   **RainbowKit:** Seamless wallet connection UI.
*   **Data Fetching:** **Alchemy RPC** (Asset Transfers API) for scalable, indexed transaction history without reliance on heavy subgraphs.
*   **UI/UX:**
    *   **Tailwind CSS:** Utility-first styling for rapid, responsive design.
    *   **Framer Motion:** Fluid transitions and animations.
    *   **React Three Fiber:** 3D rendering for the interactive gift box.

## 3. Development Process

### Phase 1: Foundation & UI Design
We began by establishing a clean, modular Next.js architecture. The focus was on creating a premium "unboxing" feel.
*   **Design System:** Implemented a component library with `GiftCard`, `GiftBox3D`, and responsive layouts.
*   **3D Integration:** Developed a lightweight 3D component that creates an engaging visual center for the gifting flow, ensuring it works efficiently in the browser.

### Phase 2: Smart Contract Integration
The core logic revolves around the `GiftBox` smart contract. We integrated the ABI to enable:
*   **Minting (Sending):** Users deposit ETH, which is "wrapped" into an NFT (ERC721) representing the gift.
*   **Redeeming (Claiming):** The recipient (NFT owner) "unwraps" the gift, burning the NFT and withdrawing the ETH.

### Phase 3: Dashboard & History Infrastructure
A key requirement was a reliable dashboard for users to track sent and received gifts.
*   **Challenge:** Direct blockchain querying for events is often slow or limited by block ranges.
*   **Innovation:** We integrated **Alchemy's `getAssetTransfers` API**. This allowed us to fetch complete history for both "Internal" (ETH deposits) and "ERC721" (Gift transfers) instantly, traversing millions of blocks without performance hits.

### Phase 4: Refinement & Polish
The final phase focused on reliability and user feedback.
*   **Context-Aware UI:** The details page was upgraded to intelligently detect if the viewer is the *Sender* (monitoring status) or the *Recipient* (ready to claim).
*   **Visual Previews:** We added dynamic gift card previews generated from on-chain data, providing a tangible counterpart to the virtual crypto transfer.

## 4. Key Technical Challenges & Solutions

During development, we encountered and overcame several significant technical hurdles.

### Build System Optimization
The initial build configuration using Turbopack faced compatibility issues with certain blockchain libraries. We successfully migrated the build pipeline to **Webpack**, leveraging its mature ecosystem to handle complex dependencies like `thread-stream` and `viem` without errors.

### Next.js 16 Adaptations
The adoption of Next.js 16 introduced stricter handling of dynamic route parameters (now asynchronous). We refactored our page components to utilize React's new `use` hook, ensuring seamless data flow and type safety for dynamic routes like `/gift/[tokenId]`.

### Scalable Data Fetching (RPC Limits)
Standard public RPC nodes often impose strict limits on historical data queries (e.g., 10,000 blocks). This would have caused the dashboard to break as the blockchain grew. By implementing a custom fetcher using **Alchemy's specialized infrastructure**, we completely bypassed these limitations, ensuring the dashboard remains fast and accurate regardless of chain length.

### Robust Type Safety
Handling blockchain data (BigInts) alongside standard JavaScript numbers (timestamps) requires precision. We implemented aggressive strict typing and input sanitization throughout the app to prevent runtime range errors, ensuring that large integer values from the contract are handled safely across the UI.

---

## 5. Conclusion
EtherGift has successfully evolved from a concept to a fully functional dApp. By combining high-fidelity 3D graphics with rock-solid blockchain infrastructure, we have created a platform that makes crypto transfers personal and engaging. The codebase is modular, type-safe, and ready for further feature expansion on the Sepolia testnet.
