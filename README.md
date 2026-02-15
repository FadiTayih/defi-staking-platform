# DeFi Token Staking Platform

A decentralized finance (DeFi) application built on Ethereum that enables users to stake mock Tether (USDT) tokens and earn Reward (RWD) tokens through yield farming.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Smart Contracts](#smart-contracts)
- [Usage](#usage)
- [License](#license)

## Features

- Token Staking: Stake mock USDT tokens to earn rewards
- Yield Farming: Earn 11.11% RWD tokens on staked amount
- Instant Withdrawal: Unstake tokens at any time
- Airdrop Timer: Visual countdown timer for reward distributions
- MetaMask Integration: Secure wallet connection
- Real-time Balance Updates: Live tracking of staking and reward balances

## Technology Stack

**Blockchain**
- Solidity ^0.5.0
- Ethereum
- Truffle 5.1.39
- Ganache

**Frontend**
- React 16.8.4
- Web3.js 1.2.11
- Bootstrap 4.3.1

**Testing**
- Mocha
- Chai

## Prerequisites

- Node.js (v12.0.0 or higher)
- npm (v6.0.0 or higher)
- Truffle (`npm install -g truffle`)
- Ganache (CLI or GUI)
- MetaMask browser extension

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/defi-staking-platform.git
cd defi-staking-platform
```

2. Install dependencies
```bash
npm install
```

3. Start Ganache on port 7545

4. Compile smart contracts
```bash
truffle compile
```

5. Deploy contracts
```bash
truffle migrate --reset
```

6. Configure MetaMask
- Add network: http://127.0.0.1:7545
- Chain ID: 5777
- Import account using Ganache private key

## Running the Application

Start the React development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

Connect your MetaMask wallet and approve the connection.

## Testing

Run the test suite:
```bash
truffle test
```

## Smart Contracts

**Tether.sol (Mock USDT)**
- ERC-20 token for staking
- Symbol: USDT
- Total Supply: 1,000,000
- Decimals: 18

**RWD.sol (Reward Token)**
- ERC-20 reward token
- Symbol: RWD
- Total Supply: 1,000,000
- Decimals: 18

**DecentralBank.sol**

Main staking contract with three core functions:

`depositeToken(uint _amount)` - Stakes USDT tokens

`unstakedTokens()` - Withdraws staked tokens

`issueToken()` - Distributes rewards (Owner only, 11.11% rate)

Reward Formula: Reward = Staking Balance ÷ 9

## Usage

**Staking Tokens**
1. Connect your MetaMask wallet
2. Enter the amount of USDT to stake
3. Approve the transaction in MetaMask
4. Confirm the deposit transaction

**Withdrawing Tokens**
1. Click the WITHDRAW button
2. Confirm the transaction in MetaMask
3. Your staked USDT returns to your wallet

**Earning Rewards**
- Rewards are distributed when the owner calls `issueToken()`
- You receive 11.11% of your staked amount per distribution

## License

This project is licensed under the MIT License.

## Author

c-money

---

For questions or issues, please open an issue on GitHub.
