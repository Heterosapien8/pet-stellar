// app.js

import {
  Contract,
  SorobanRpc,
  Networks,
  TransactionBuilder,
  BASE_FEE,
  Keypair,
} from "https://cdn.jsdelivr.net/npm/@stellar/stellar-sdk/+esm";

// Replace with your contract ID
const contractId = "CCJ3ITE2DBRYX52RGYOJDGWEQW5QFPOAL5NHAARJDCADD3BT2TR7GFV7";

document.getElementById("createPet").addEventListener("click", async () => {
  const owner = document.getElementById("ownerAddress").value;
  const name = document.getElementById("petName").value;
  document.getElementById("output").innerText = `Creating pet named ${name}...`;
});

document.getElementById("feedPet").addEventListener("click", async () => {
  document.getElementById("output").innerText = "Feeding your pet... 🥕";
});

document.getElementById("playPet").addEventListener("click", async () => {
  document.getElementById("output").innerText = "Playing with your pet 🎾";
});

document.getElementById("getStatus").addEventListener("click", async () => {
  document.getElementById("output").innerText = "Fetching pet status...";
});
