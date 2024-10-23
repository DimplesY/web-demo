const solanaWeb3 = require('@solana/web3.js');

const connect = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'))

// 批量创建钱包函数
async function createSolanaWallets(batchSize) {
    const wallets = [];
    
    for (let i = 0; i < batchSize; i++) {
        // 创建新的Keypair（钱包）
        const keypair = solanaWeb3.Keypair.generate();
        // 获取钱包的私钥和公钥
        const secretKey = keypair.secretKey;
        const publicKey = keypair.publicKey.toString();
        
        wallets.push({
            public_key: publicKey,
            secret_key: Array.from(secretKey)  // 将Uint8Array转换为普通数组
        });
    }
    
    return wallets;
}

// 设置要创建的钱包数量
const walletCount = 10;  // 你可以根据需要修改数量

// 执行批量创建钱包的函数
createSolanaWallets(walletCount).then(wallets => {
    // 输出生成的钱包公钥和私钥
    wallets.forEach((wallet, index) => {
        console.log(`Wallet ${index + 1}:`);
        console.log(`Public Key: ${wallet.public_key}`);
        console.log(`Secret Key: ${wallet.secret_key}`);
        console.log('-'.repeat(30));
    });
});
