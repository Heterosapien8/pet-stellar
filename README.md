# 🐾 Pet Stellar — Digital Pet Smart Contract on Stellar

A decentralized **digital pet** game built using **Rust** and **Soroban smart contracts** on the **Stellar blockchain**.  
Users can **adopt, feed, play, and check the status** of their on-chain pets — all stored immutably and transparently.

---

## 🚀 Live Contract
**Contract ID:** `CCJ3ITE2DBRYX52RGYOJDGWEQW5QFPOAL5NHAARJDCADD3BT2TR7GFV7`  
[View on Stellar Explorer 🌐](https://stellar.expert/explorer/testnet/contract/CCJ3ITE2DBRYX52RGYOJDGWEQW5QFPOAL5NHAARJDCADD3BT2TR7GFV7)

<img width="1078" height="411" alt="image" src="https://github.com/user-attachments/assets/9f0d1091-8115-45dd-9eaf-6824a21ca270" />

---

## 🧠 Smart Contract Functions

| Function | Description | Parameters | Returns |
|-----------|-------------|-------------|----------|
| `create_pet(owner, name)` | Creates a new pet for a user | `owner: Address`, `name: String` | None |
| `feed_pet(owner)` | Increases pet happiness and decreases hunger | `owner: Address` | None |
| `play_pet(owner)` | Further increases pet happiness | `owner: Address` | None |
| `get_pet_status(owner)` | Retrieves pet’s hunger and happiness stats | `owner: Address` | `Pet` struct |

---

## 🐕 Pet Structure
```rust
struct Pet {
  name: String,
  happiness: i32,
  hunger: i32,
}

Create pet command:
stellar contract invoke \
  --id CCJ3ITE2DBRYX52RGYOJDGWEQW5QFPOAL5NHAARJDCADD3BT2TR7GFV7 \
  --network testnet \
  --source pet-owner \
  -- \
  create_pet \
  $(stellar keys address pet-owner) "Buddy"

Feed pet command:
stellar contract invoke \
  --id CCJ3ITE2DBRYX52RGYOJDGWEQW5QFPOAL5NHAARJDCADD3BT2TR7GFV7 \
  --network testnet \
  --source pet-owner \
  -- \
  feed_pet \
  $(stellar keys address pet-owner)

Play with pet command:
stellar contract invoke \
  --id CCJ3ITE2DBRYX52RGYOJDGWEQW5QFPOAL5NHAARJDCADD3BT2TR7GFV7 \
  --network testnet \
  --source pet-owner \
  -- \
  play_pet \
  $(stellar keys address pet-owner)

check pet status command:
stellar contract invoke \
  --id CCJ3ITE2DBRYX52RGYOJDGWEQW5QFPOAL5NHAARJDCADD3BT2TR7GFV7 \
  --network testnet \
  --source pet-owner \
  -- \
  get_pet_status \
  $(stellar keys address pet-owner)
