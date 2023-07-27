import { ethers } from "./ethers-5.2.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connect-btn")
const fundButton = document.getElementById("fund-btn")
const balanceButton = document.getElementById("balance-btn")
const withdrawButton = document.getElementById("withdraw-btn")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
        } catch (err) {
            console.log(err)
        }
        connectButton.innerHTML = "Connected!"
        console.log(ethers)
    } else {
        connectButton.innerHTML = "Please install MetaMask"
    }
}
async function fund() {
    const ethAmount = document.getElementById("eth-amount").value
    if (window.ethereum) {
        console.log(`Funding with ${ethAmount}`)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transaction = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMine(transaction, provider)
            console.log("Done")
        } catch (err) {
            console.log(err)
        }
    }
}

function listenForTransactionMine(transaction, provider) {
    console.log(`Mining ${transaction.hash}...`)
    return new Promise((resolve, reject) => {
        provider.once(transaction.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`,
            )
            resolve()
        })
    })
}

async function getBalance() {
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function withdraw() {
    if (window.ethereum) {
        console.log("Withdrawing...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transaction = await contract.withdraw()
            await listenForTransactionMine(transaction, provider)
            console.log("Done")
        } catch (error) {
            console.log(error)
        }
    }
}
