"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

// ERC20 ABI（只保留常用接口）
const erc20Abi = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

export default function Home() {
  const [account, setAccount] = useState("");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [events, setEvents] = useState([]);

  // 连接钱包
  async function connectWallet() {
    if (!window.ethereum) {
      alert("请先安装 MetaMask");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const addr = await signer.getAddress();
    setAccount(addr);
  }

  // 查询 ETH 余额
  async function getEthBalance() {
    if (!address) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(address);
    setBalance(ethers.formatEther(balance) + " ETH");
  }

  // 查询 ERC20 Token 余额
  async function getTokenBalance() {
    if (!address || !tokenAddress) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(tokenAddress, erc20Abi, provider);

    const bal = await contract.balanceOf(address);
    const decimals = await contract.decimals();
    const symbol = await contract.symbol();

    const formatted = Number(bal) / 10 ** decimals;
    setTokenBalance(formatted + " " + symbol);
  }

  // 转账 ETH
  async function sendTransaction(to, amount) {
    if (!window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const tx = await signer.sendTransaction({
      to,
      value: ethers.parseEther(amount),
    });
    await tx.wait();
    alert("交易成功！交易哈希：" + tx.hash);
  }

  // 监听 ERC20 Transfer 事件
  useEffect(() => {
    if (!tokenAddress) return;

    async function listenEvents() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, erc20Abi, provider);

      contract.on("Transfer", (from, to, value) => {
        setEvents((prev) => [
          {
            from,
            to,
            value: ethers.formatUnits(value, 18),
            time: new Date().toLocaleTimeString(),
          },
          ...prev,
        ]);
      });
    }

    listenEvents();

    return () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(tokenAddress, erc20Abi, provider);
        contract.removeAllListeners("Transfer");
      }
    };
  }, [tokenAddress]);

  return (
    <main className="flex flex-col items-center p-8 space-y-6">
      <h1 className="text-2xl font-bold">🚀 Web3 Demo</h1>

      {/* 连接钱包 */}
      <button
        onClick={connectWallet}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        连接钱包
      </button>
      {account && <p>当前账户: {account}</p>}

      {/* 查询 ETH */}
      <div className="space-y-2 border p-4 rounded w-full max-w-md">
        <h2 className="font-semibold">查询 ETH 余额</h2>
        <input
          className="border p-2 w-full"
          placeholder="输入地址"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button
          onClick={getEthBalance}
          className="px-4 py-2 bg-green-600 text-white rounded w-full"
        >
          查询
        </button>
        {balance && <p>余额: {balance}</p>}
      </div>

      {/* 查询 ERC20 */}
      <div className="space-y-2 border p-4 rounded w-full max-w-md">
        <h2 className="font-semibold">查询 Token 余额</h2>
        <input
          className="border p-2 w-full"
          placeholder="Token 合约地址"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />
        <button
          onClick={getTokenBalance}
          className="px-4 py-2 bg-purple-600 text-white rounded w-full"
        >
          查询 Token
        </button>
        {tokenBalance && <p>Token 余额: {tokenBalance}</p>}
      </div>

      {/* 转账 ETH */}
      <div className="space-y-2 border p-4 rounded w-full max-w-md">
        <h2 className="font-semibold">转账 ETH</h2>
        <input
          className="border p-2 w-full"
          placeholder="接收地址"
          id="to"
        />
        <input
          className="border p-2 w-full"
          placeholder="金额 (ETH)"
          id="amount"
        />
        <button
          onClick={() =>
            sendTransaction(
              document.getElementById("to").value,
              document.getElementById("amount").value
            )
          }
          className="px-4 py-2 bg-orange-600 text-white rounded w-full"
        >
          转账
        </button>
      </div>

      {/* 事件监听 */}
      {tokenAddress && (
        <div className="space-y-2 border p-4 rounded w-full max-w-md">
          <h2 className="font-semibold">Token 转账事件监听</h2>
          <ul className="space-y-1 max-h-40 overflow-y-auto text-sm">
            {events.map((ev, i) => (
              <li key={i} className="border-b py-1">
                <p>⏰ {ev.time}</p>
                <p>From: {ev.from}</p>
                <p>To: {ev.to}</p>
                <p>Value: {ev.value}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
