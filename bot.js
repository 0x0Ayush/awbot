const fetch = require('node-fetch').default;
const crypto = require('crypto');

async function getLastMineTx() {
  const accountName = 'account_name';
  const apiUrl = `https://wax.eosdac.io/v2/history/get_actions?account=${accountName}&filter=mine&sort=desc&limit=1`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  if (data.actions.length === 0) {
    throw new Error('No mine actions found for account');
  }

  return data.actions[0];
}

async function generateNonce(accountName) {
  const lastMineTx = await getLastMineTx();
  const lastMineTxId = lastMineTx.action_trace.trx_id;
  const nonce = Math.floor(Math.random() * 1000000000); // Generate a random nonce
  const hash = crypto.createHash('sha256');
  const data = accountName + lastMineTxId.slice(0, 8) + nonce.toString();
  hash.update(data);
  const nonceHash = hash.digest('hex');
  return nonceHash;
}

async function mine() {
  const accountName = 'account_name';
  const nonce = await generateNonce(accountName);
  // Your mining code here...
  console.log(nonce);
}

// Example usage
mine();
