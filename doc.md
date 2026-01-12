# Agent402

## Introduction

As autonomous agents become more capable, a new problem emerges:

How can one agent safely, programmatically, and autonomously pay another agent for premium capabilities?

Traditional approaches rely on:

- API keys
- Manual billing
- Trusted servers
- Human-controlled access

These break agent autonomy.

This protocol introduces a crypto-native, intent-based payment and access system that allows agents to:

- Discover premium agents
- Understand access requirements
- Pay on-chain
- Cryptographically prove payment
- Receive gated responses
- Operate without human intervention

## What This Protocol Solves

### Problems Today

- Agents cannot natively monetize themselves
- Access control between agents is trust-based
- Payment verification is tightly coupled to centralized systems
- No standard flow for agent-to-agent paid interactions

### What This Enables

- Programmatic monetization for agents
- Trust-minimized payment verification
- On-chain settlement with off-chain coordination
- Fully autonomous agent economies

## Core Concepts

### Agents

- **Agent 1 (Consumer Agent)**
  - Requests access to premium capabilities.

- **Agent 2 (Premium Agent)**
  - Offers gated functionality in exchange for payment.

### Facilitator

A verifier that:

- Registers payment intents
- Verifies on-chain transactions
- Validates cryptographic intent signatures
- Tracks intent consumption

The facilitator:

- Does not hold funds
- Does not make decisions
- Only returns verifiable truth

### Intent

An intent represents:

- The purpose of a payment
- The expected recipient
- The required amount
- The requesting agent
- A unique identifier

It is:

- Registered before payment
- Signed after payment
- Verified before access is granted
- Consumed after use

## High-Level Architecture
```
+---------+        +-------------+        +-------------+
| Agent 1 | <----> | Facilitator | <----> | Blockchain  |
+---------+        +-------------+        +-------------+
      |
      |
      v
+-------------+
|  Agent 2    |
| (Premium)   |
+-------------+

```

- Blockchain = settlement layer

- Facilitator = verification layer

- Agents = execution layer

## Detailed Flow

1. **Agent Discovery**

	When Agent 1 connects to Agent 2, it receives an Agent Card.

	The Agent Card contains:

	- Agent description (what it can do)
	- Whether the agent is premium
	- Facilitator URL
	- Agent 2 wallet address
	- Required payment amount
	- Supported tokens / chain

	Example:

	```json
	{
	  "name": "CodeAnalysisAgent",
	  "premium": true,
	  "price": "0.01 ETH",
	  "wallet": "0xAgent2Wallet",
	  "facilitator": "https://facilitator.example.xyz"
	}
	```

2. **Intent Registration**

	If Agent 1 decides to access premium functionality:

	- Agent 1 calls the Facilitator
	- Facilitator registers a new intent
	- Facilitator returns the intent details to Agent 1

	Intent includes:

	- `intentId`
	- `agentFrom`
	- `agentTo`
	- `amount`

3. **On-Chain Payment**

	Agent 1:

	- Sends on-chain payment
	- Transfers required amount directly to Agent 2’s wallet
	- Records the transaction hash

	No funds ever pass through the facilitator.

4. **Intent Signing & Request**

	After payment:

	- Agent 1 cryptographically signs the intent
	- Agent 1 sends to Agent 2:
	  - Original request
	  - Signed intent
	  - Transaction hash

5. **Verification by Facilitator**

	When Agent 2 receives the request:

	- Agent 2 calls the Facilitator
	- Sends:
	  - `intentId`
	  - signed intent
	  - transaction hash

	Facilitator verifies:

	- Transaction exists on-chain
	- Payment amount is correct
	- Recipient address matches Agent 2
	- Intent signature is valid
	- Intent has not been consumed

6. **Access Granted**

	If verification succeeds:

	- Facilitator responds with OK
	- Agent 2 processes the premium request
	- Agent 2 returns the gated content to Agent 1

7. **Intent Consumption**

	After successful processing:

	- Agent 2 notifies Facilitator
	- Facilitator marks the intent as consumed

	Intent cannot be reused — this prevents replay attacks.

## Sequence Diagram
```
Agent 1        Facilitator        Blockchain        Agent 2
	|                |                 |                |
	|--- discover -->|                 |                |
	|<-- agent card--|                 |                |
	|                |                 |                |
	|-- register --->|                 |                |
	|<-- intent -----|                 |                |
	|                |                 |                |
	|---- payment -------------------> |                |
	|                |                 |                |
	|-- request + signed intent ----------------------> |
	|                |                 |                |
	|                |<-- verify ------|                |
	|                |---- ok -------->|                |
	|                |                 |                |
	|<-- response ------------------------------------- |
	|                |                 |                |
	|-- consume ---->|                 |                |
```
## Security Properties

- No trusted custody
- No API keys
- No shared secrets
- Replay protection via intent consumption
- Cryptographic proof of payment
- On-chain source of truth

## Use Cases

1. **Premium AI Models**

	Agents offering:

	- Advanced reasoning
	- Proprietary datasets
	- Costly inference

2. **Agent Marketplaces**

	Autonomous buying & selling of agent services

3. **Tool-as-Agent Services**

	- Code generation agents
	- Security analysis agents
	- Data enrichment agents

4. **Autonomous Workflows**

	Agents paying other agents mid-task:

	- Research
	- Validation
	- Optimization

## Why This Matters

This protocol enables:

- True agent autonomy
- Native monetization
- Composable agent economies
- Crypto-native access control

Agents can finally:

Discover → Decide → Pay → Verify → Execute
without humans in the loop.
