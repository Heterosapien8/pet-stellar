// -----------------------------------------------------
// 🐾 Pet Stellar Frontend - Final Working Version
// Using @stellar/stellar-sdk for Soroban
// -----------------------------------------------------

import * as StellarSdk from "@stellar/stellar-sdk";
const {
  rpc: SorobanRpc,
  Contract,
  Keypair,
  xdr,
  Address,
  Networks,
} = StellarSdk;

window.StellarSdk = StellarSdk;
window.SorobanRpc = SorobanRpc;

console.log("✅ Stellar SDK imported successfully:", typeof StellarSdk);

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ DOM fully loaded");

  // -----------------------------------------------------
  // Configuration
  // -----------------------------------------------------
  const CONFIG = {
    CONTRACT_ID: "CCJ3ITE2DBRYX52RGYOJDGWEQW5QFPOAL5NHAARJDCADD3BT2TR7GFV7",
    RPC_URL: "http://localhost:8080/soroban-rpc",
    NETWORK_PASSPHRASE: "Test SDF Network ; September 2015",
    ACCOUNT_PUBLIC: "GCTYNEDRO2JPW2P77YUE7DAMLF7DHZ6USEH7VVJJG3SNAEBNSD74N7HA",
    ACCOUNT_SECRET: "SBOKU4QJ3WPSHG7DT3K3I7OCEGRQ6H7PBXCHZH5F4BCBBV44V2DWVP4S",
  };

  // -----------------------------------------------------
  // Status message display helper
  // -----------------------------------------------------
  function showStatus(message, type = "info") {
    const statusEl = document.getElementById("statusMessage");
    if (!statusEl) {
      console.error("❌ statusMessage element not found in DOM");
      return;
    }

    statusEl.textContent = message;
    const color =
      type === "error"
        ? "text-red-400"
        : type === "success"
        ? "text-green-400"
        : "text-cyan-400";
    statusEl.className = `mt-6 text-center text-lg font-semibold ${color}`;
    statusEl.classList.remove("hidden");
    setTimeout(() => statusEl.classList.add("hidden"), 5000);
  }

  // -----------------------------------------------------
  // Soroban RPC Setup
  // -----------------------------------------------------
  const server = new SorobanRpc.Server(CONFIG.RPC_URL, { allowHttp: true });
  const keypair = Keypair.fromSecret(CONFIG.ACCOUNT_SECRET);

  console.log("✅ Connected to Soroban RPC:", CONFIG.RPC_URL);

  // -----------------------------------------------------
  // Main contract call function
  // -----------------------------------------------------
  async function callContract(fnName, args = []) {
    try {
      showStatus(`⏳ Executing ${fnName}...`, "info");
      console.log(
        `📡 Calling ${fnName} with args:`,
        args.map((a) => a.toXDR("base64"))
      );

      // Load account
      const account = await server.getAccount(CONFIG.ACCOUNT_PUBLIC);
      const contract = new Contract(CONFIG.CONTRACT_ID);

      // Build transaction
      let tx = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call(fnName, ...args))
        .setTimeout(30)
        .build();

      console.log("🔍 Simulating transaction...");

      // Simulate transaction
      const simResponse = await server.simulateTransaction(tx);
      console.log("📊 Simulation response:", simResponse);

      if (SorobanRpc.Api.isSimulationError(simResponse)) {
        throw new Error(`Simulation error: ${simResponse.error}`);
      }

      if (!simResponse.result) {
        throw new Error("Simulation returned no result");
      }

      // Assemble and sign transaction
      const assembledTx = SorobanRpc.assembleTransaction(
        tx,
        simResponse
      ).build();
      assembledTx.sign(keypair);

      console.log("📤 Sending transaction...");
      const sendResponse = await server.sendTransaction(assembledTx);
      console.log("✅ Transaction sent:", sendResponse);

      if (sendResponse.status === "PENDING") {
        console.log("⏳ Waiting for transaction confirmation...");

        let getResponse = await server.getTransaction(sendResponse.hash);
        let attempts = 0;

        while (getResponse.status === "NOT_FOUND" && attempts < 10) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          getResponse = await server.getTransaction(sendResponse.hash);
          attempts++;
        }

        if (getResponse.status === "SUCCESS") {
          console.log("🎉 Transaction successful!");
          showStatus(`✅ ${fnName} executed successfully!`, "success");

          // Decode get_pet_status result
          if (fnName === "get_pet_status" && getResponse.returnValue) {
            try {
              const decoded = getResponse.returnValue;
              console.log("📋 Pet status:", decoded);
              showStatus(
                `🐶 Pet Status: ${JSON.stringify(decoded)}`,
                "success"
              );
            } catch (err) {
              console.warn("⚠️ Could not decode pet status:", err);
            }
          }
        } else {
          throw new Error(`Transaction failed: ${getResponse.status}`);
        }
      } else {
        throw new Error(`Unexpected send status: ${sendResponse.status}`);
      }
    } catch (err) {
      console.error("❌ Error calling contract:", err);
      showStatus(`❌ ${fnName}: ${err.message || err}`, "error");
    }
  }

  // -----------------------------------------------------
  // Contract function wrappers
  // -----------------------------------------------------
  async function createPet(name) {
    const ownerAddress = Address.fromString(CONFIG.ACCOUNT_PUBLIC);
    const args = [ownerAddress.toScVal(), xdr.ScVal.scvString(name)];
    console.log(
      "🐾 Creating pet with args:",
      args.map((a) => a.toXDR("base64"))
    );
    await callContract("create_pet", args);
  }

  async function feedPet() {
    const ownerAddress = Address.fromString(CONFIG.ACCOUNT_PUBLIC);
    const args = [ownerAddress.toScVal()];
    console.log(
      "🍖 Feeding pet with args:",
      args.map((a) => a.toXDR("base64"))
    );
    await callContract("feed_pet", args);
  }

  async function playPet() {
    const ownerAddress = Address.fromString(CONFIG.ACCOUNT_PUBLIC);
    const args = [ownerAddress.toScVal()];
    console.log(
      "🎾 Playing with pet with args:",
      args.map((a) => a.toXDR("base64"))
    );
    await callContract("play_pet", args);
  }

  async function getPetStatus() {
    const ownerAddress = Address.fromString(CONFIG.ACCOUNT_PUBLIC);
    const args = [ownerAddress.toScVal()];
    console.log(
      "📋 Getting pet status:",
      args.map((a) => a.toXDR("base64"))
    );
    await callContract("get_pet_status", args);
  }

  // -----------------------------------------------------
  // Button bindings
  // -----------------------------------------------------
  const createPetBtn = document.getElementById("createPetBtn");
  const feedPetBtn = document.getElementById("feedPetBtn");
  const playPetBtn = document.getElementById("playPetBtn");
  const getStatusBtn = document.getElementById("getStatusBtn");

  if (createPetBtn)
    createPetBtn.onclick = () => {
      const nameInput = document.getElementById("petName");
      const name = nameInput?.value.trim() || "Buddy";
      createPet(name);
    };

  if (feedPetBtn) feedPetBtn.onclick = feedPet;
  if (playPetBtn) playPetBtn.onclick = playPet;
  if (getStatusBtn) getStatusBtn.onclick = getPetStatus;

  console.log("✅ All button handlers attached");
});
