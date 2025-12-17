// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GiftBox
 * @dev A decentralized gifting protocol that wraps ETH in transferable NFT gift boxes.
 * 
 * Features:
 * - Sender deposits ETH and mints a gift NFT to recipient
 * - Gift can be transferred between wallets until claimed
 * - Only current NFT owner can claim (unwrap) the gift
 * - Original sender can ONLY recall if gift hasn't been transferred
 * 
 * Security:
 * - ReentrancyGuard on all state-changing functions
 * - Recall only allowed if gift is still with original recipient (prevents rug pull)
 * - Removed ERC721Enumerable to reduce gas costs
 */
contract GiftBox is ERC721, ReentrancyGuard {
    
    // ============ Types ============
    
    enum BoxStyle { Silver, Gold, Obsidian }
    
    struct Gift {
        address sender;              // Original gift sender
        address originalRecipient;   // First recipient (for recall check)
        uint256 amount;              // ETH amount locked
        string message;              // Personal note
        BoxStyle boxStyle;           // Visual style
        uint256 createdAt;           // Timestamp
        bool claimed;                // Has been unwrapped
    }
    
    // ============ State ============
    
    uint256 private _nextTokenId;
    
    // tokenId => Gift data
    mapping(uint256 => Gift) public gifts;
    
    // ============ Events ============
    
    event GiftCreated(
        uint256 indexed tokenId,
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        BoxStyle boxStyle
    );
    
    event GiftClaimed(
        uint256 indexed tokenId,
        address indexed claimer,
        uint256 amount
    );
    
    event GiftRecalled(
        uint256 indexed tokenId,
        address indexed sender,
        uint256 amount
    );
    
    // ============ Errors ============
    
    error InsufficientAmount();
    error NotGiftOwner();
    error NotGiftSender();
    error GiftAlreadyClaimed();
    error GiftAlreadyTransferred();
    error TransferFailed();
    error GiftDoesNotExist();
    error InvalidRecipient();
    
    // ============ Constructor ============
    
    constructor() ERC721("EtherGift", "GIFT") {}
    
    // ============ Core Functions ============
    
    /**
     * @dev Create a new gift by depositing ETH and minting an NFT to the recipient.
     * @param recipient The address that will receive the gift NFT
     * @param message A personal note attached to the gift
     * @param boxStyle The visual style of the gift box (0=Silver, 1=Gold, 2=Obsidian)
     * @return tokenId The ID of the newly minted gift NFT
     */
    function mint(
        address recipient,
        string calldata message,
        BoxStyle boxStyle
    ) external payable nonReentrant returns (uint256) {
        if (msg.value == 0) revert InsufficientAmount();
        if (recipient == address(0)) revert InvalidRecipient();
        if (recipient == msg.sender) revert InvalidRecipient();
        
        uint256 tokenId = _nextTokenId++;
        
        gifts[tokenId] = Gift({
            sender: msg.sender,
            originalRecipient: recipient,
            amount: msg.value,
            message: message,
            boxStyle: boxStyle,
            createdAt: block.timestamp,
            claimed: false
        });
        
        _safeMint(recipient, tokenId);
        
        emit GiftCreated(tokenId, msg.sender, recipient, msg.value, boxStyle);
        
        return tokenId;
    }
    
    /**
     * @dev Claim (unwrap) a gift. Burns the NFT and sends locked ETH to the caller.
     * @param tokenId The ID of the gift to claim
     * 
     * @notice If the caller is a smart contract without a receive() function,
     * this transaction will revert. Ensure your wallet can accept raw ETH.
     */
    function withdraw(uint256 tokenId) external nonReentrant {
        if (!_exists(tokenId)) revert GiftDoesNotExist();
        if (ownerOf(tokenId) != msg.sender) revert NotGiftOwner();
        
        Gift storage gift = gifts[tokenId];
        if (gift.claimed) revert GiftAlreadyClaimed();
        
        uint256 amount = gift.amount;
        gift.claimed = true;
        
        _burn(tokenId);
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) revert TransferFailed();
        
        emit GiftClaimed(tokenId, msg.sender, amount);
    }
    
    /**
     * @dev Recall an unclaimed gift. Only the original sender can call this,
     * AND only if the gift is still owned by the original recipient.
     * 
     * This prevents the "recall rug pull" attack where a sender could
     * reclaim funds after the gift has been transferred/sold to a third party.
     * 
     * @param tokenId The ID of the gift to recall
     */
    function recall(uint256 tokenId) external nonReentrant {
        if (!_exists(tokenId)) revert GiftDoesNotExist();
        
        Gift storage gift = gifts[tokenId];
        if (gift.sender != msg.sender) revert NotGiftSender();
        if (gift.claimed) revert GiftAlreadyClaimed();
        
        // CRITICAL: Only allow recall if gift hasn't been transferred
        address currentOwner = ownerOf(tokenId);
        if (currentOwner != gift.originalRecipient) revert GiftAlreadyTransferred();
        
        uint256 amount = gift.amount;
        gift.claimed = true;
        
        _burn(tokenId);
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) revert TransferFailed();
        
        emit GiftRecalled(tokenId, msg.sender, amount);
    }
    
    // ============ View Functions ============
    
    /**
     * @dev Get full gift details
     */
    function getGift(uint256 tokenId) external view returns (
        address sender,
        uint256 amount,
        string memory message,
        BoxStyle boxStyle,
        uint256 createdAt,
        bool claimed,
        address currentOwner
    ) {
        if (!_exists(tokenId) && !gifts[tokenId].claimed) revert GiftDoesNotExist();
        
        Gift storage gift = gifts[tokenId];
        return (
            gift.sender,
            gift.amount,
            gift.message,
            gift.boxStyle,
            gift.createdAt,
            gift.claimed,
            gift.claimed ? address(0) : ownerOf(tokenId)
        );
    }
    
    /**
     * @dev Check if sender can still recall a gift
     * Returns true only if sender is original sender AND gift is still with original recipient
     */
    function canRecall(uint256 tokenId) external view returns (bool) {
        if (!_exists(tokenId)) return false;
        
        Gift storage gift = gifts[tokenId];
        if (gift.claimed) return false;
        
        address currentOwner = ownerOf(tokenId);
        return currentOwner == gift.originalRecipient;
    }
    
    /**
     * @dev Check if a token exists (not burned)
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return tokenId < _nextTokenId && _ownerOf(tokenId) != address(0);
    }
    
    /**
     * @dev Get the next token ID (useful for frontend)
     */
    function nextTokenId() external view returns (uint256) {
        return _nextTokenId;
    }
}
