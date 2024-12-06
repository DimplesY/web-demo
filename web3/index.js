const solanaWeb3 = require('@solana/web3.js');

const connect = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'))


connect.getTransactionCount('7dHb96oR3uJyv9A4cJvYCPJ5Vg2tqNwQVvR9dP70NQ5').then(res => {
    console.log(res)
})
