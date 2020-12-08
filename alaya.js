var Web3 = require("web3");
let web3 = null;
class Wallet {
    #walletPrivateKey = ''
    #walletAddress = []

    constructor(privateKey) {
        if (!privateKey) {
            throw new Error('privateKey 错误');
        }

        !web3 && (web3 = new Web3("http://127.0.0.1:6789"));
        this.#walletPrivateKey = '0x' + privateKey;
        this.#walletAddress = web3.platon.accounts.privateKeyToAccount(this.#walletPrivateKey).address;
    }

    /**
     * Modify the underlying communication service provider
     * @param {*} provider 
     */
    setProvider = function (provider) {
        web3.setProvider(provider);
    }

    /**
     * Transfer to the destination address
     * @param {*} targets 目标地址
     */
    transferOld = async function (targets) {
        let nodeInfo = await web3.ppos.rpc('admin_nodeInfo');
        let chainId = nodeInfo.protocols.platon.config.chainId;

        let from = this.#walletAddress.mainnet;

        for (let index = 0; index < targets.length; index++) {
            let nonce = web3.utils.numberToHex(await web3.platon.getTransactionCount(from));
            const target = targets[index];
            var address = target.address
            var value = target.value
            let tx = {
                from: from,
                to: address,
                value: web3.utils.toVon(value.toString(), 'atp'),
                chainId: chainId,
                gasPrice: web3.platon.getGasPrice(),
                gas: "21000",
                data: web3.utils.utf8ToHex(''),
                nonce: nonce,
            };
            let signTx = await web3.platon.accounts.signTransaction(tx, this.#walletPrivateKey);
            let receipt = await web3.platon.sendSignedTransaction(signTx.rawTransaction);
            target.transactionHash = receipt['transactionHash'];
        }
        return targets;
    }

    /**
     * Transfer to the destination address
     * @param {*} address 
     * @param {*} value 
     */
    transfer = async function (address, value) {
        let nodeInfo = await web3.ppos.rpc('admin_nodeInfo');
        let chainId = nodeInfo.protocols.platon.config.chainId;

        let from = this.#walletAddress.mainnet;

        let nonce = web3.utils.numberToHex(await web3.platon.getTransactionCount(from));
        var address = address
        var value = value
        let tx = {
            from: from,
            to: address,
            value: web3.utils.toVon(value.toString(), 'atp'),
            chainId: chainId,
            gasPrice: web3.platon.getGasPrice(),
            gas: "21000",
            data: web3.utils.utf8ToHex(''),
            nonce: nonce,
        };
        let signTx = await web3.platon.accounts.signTransaction(tx, this.#walletPrivateKey);
        let receipt = await web3.platon.sendSignedTransaction(signTx.rawTransaction);
        return receipt.transactionHash;
        return receipt['transactionHash'];
    }

    /**
     * Get the wallet address, such as atpxxxxxx
     */
    getWalletAddress = function () {
        return this.#walletAddress.mainnet;
    }

    /**
     * Get wallet Balance
     */
    getBalance = async function () {
        let balance = await web3.platon.getBalance(this.#walletAddress.mainnet);
        let atp = web3.utils.fromVon(balance, 'atp');
        return {
            'walletAddress': this.#walletAddress.mainnet,
            'balance': atp,
        };
    }
}

class Platon {
    constructor() {
        !web3 && (web3 = new Web3("http://127.0.0.1:6789"));
    }
}

exports.wallet = Wallet;
exports.platon = Platon;
