import React, { useState, useEffect, useRef } from 'react';
import Web3 from 'web3';
import * as XLSX from 'xlsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { tokenContract } from './contract/listen-contract.js';

const web3 = new Web3(Web3.givenProvider);

export default function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [file, setFile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [rowAmount, setRowAmount] = useState(0);
  const fileRef = useRef(null);

  // const [transferWalletAddress, setTransferWalletAddress] = useState('');
  // const [transferAmount, setTransferAmount] = useState('');

  const [transferWalletAddressFromExcel, setTransferWalletAddressFromExcel] = useState([]);
  const [transferAmountFromExcel, setTransferAmountFromExcel] = useState([]);




  // const handleTransferTokenFromExcel = async () => {
  //   const contractResult = await tokenContract();
  //   if (walletAddress && transferWalletAddressFromExcel.length && transferAmountFromExcel.length) {
  //     try {
  //       const decimals = await contractResult.decimals();
  
  //       for (let i = 0; i < transferWalletAddressFromExcel.length; i++) {
  //         const amountToSend = (BigInt(Math.floor(Number(transferAmountFromExcel[i]) * Math.pow(10, decimals)))).toString();
  //         const addressToSend = transferWalletAddressFromExcel[i];
  
  //         const balance = await contractResult.balanceOf(walletAddress);
  //         if (balance < amountToSend) {
  //           toast.error('Insufficient balance');
  //           return;
  //         }
  
  //         const transferResult = await contractResult.transfer(addressToSend, amountToSend);
  //         console.log(`Transfer result for ${addressToSend}:`, transferResult);
  //       }  
  
  //       toast.success('All tokens transferred successfully');
  //     } catch (error) {
  //       console.error('Error transferring tokens', error);
  //       toast.error('Error transferring tokens');
  //     }
  //   } else {
  //     toast.error('Please provide valid wallet addresses and amounts');
  //   }
  // };


  

  const handleTransferTokenFromExcel = async () => {
    const contractResult = await tokenContract();
    if (walletAddress && transferWalletAddressFromExcel.length && transferAmountFromExcel.length) {
      try {
        const decimals = await contractResult.decimals();
        const batchTransfers = [];
  
        for (let i = 0; i < transferWalletAddressFromExcel.length; i++) {
          const amountToSend = (BigInt(Math.floor(Number(transferAmountFromExcel[i]) * Math.pow(10, decimals)))).toString();
          const addressToSend = transferWalletAddressFromExcel[i];
  
          batchTransfers.push(contractResult.transfer(addressToSend, amountToSend));
        }
  
        const batchTransferResult = await Promise.all(batchTransfers);
        console.log(`Batch transfer result:`, batchTransferResult);
        toast.success('All tokens transferred successfully');
        setTimeout(() => {
          window.location.reload(); 
        }, 10000);
      } catch (error) {
        console.error('Error transferring tokens', error);
        toast.error('Error transferring tokens');
      }
    } else {
      toast.error('Please provide valid wallet addresses and amounts');
    }
  };
  
  



  // const handleTransferToken = async () => {
  //   const contractResult = await tokenContract();
  //   if (walletAddress && transferWalletAddress && transferAmount) {
  //     try {
  //       const decimals = await contractResult.decimals();
  //       const amountToSend = (BigInt(Math.floor(Number(transferAmount) * Math.pow(10, decimals)))).toString();
  
  //       const balance = await contractResult.balanceOf(walletAddress);
  //       if (balance < amountToSend) {
  //         toast.error('Insufficient balance');
  //         return;
  //       }
  
  //       const transferResult = await contractResult.transfer(transferWalletAddress, amountToSend);
  //       console.log(transferResult);
  //       toast.success('Token transferred successfully');
  //     } catch (error) {
  //       console.error('Error transferring token', error);
  //       toast.error('Error transferring token');
  //     }
  //   } else {
  //     toast.error('Please provide a valid wallet address and amount');
  //   }
  // };
  


  const getBalance = async () => {
    const contractResult = await tokenContract();
    if (walletAddress && contractResult) {
      const balanceOf = await contractResult.balanceOf(walletAddress);
      const decimals = await contractResult.decimals();
      setWalletBalance(Number(balanceOf) / Math.pow(10, decimals));
    }
  };

  useEffect(() => {
    if (walletAddress) {
      // handleTransferToken();
      getBalance();
    }
  }, [walletAddress]);

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        handleDisconnectMetamask();
        toast.info('Metamask disconnected');
      } else {
        const address = accounts[0];
        setWalletAddress(address);
      }
    };
  
    const handleDisconnect = () => {
      handleDisconnectMetamask();
    };
  
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('disconnect', handleDisconnect);
  
      web3.eth.getAccounts().then((accounts) => {
        if (accounts.length > 0) {
          handleAccountsChanged(accounts);
          setIsConnected(true);
        }
      });
  
      window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
        }
      });
    }
  
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
    }, []);

  const switchToBSC = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x61' }]
      });
      return true;
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x61',
                chainName: 'Binance Smart Chain Testnet',
                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                nativeCurrency: {
                  name: 'Binance Coin',
                  symbol: 'BNB',
                  decimals: 18
                },
                blockExplorerUrls: ['https://testnet.bscscan.com/']
              }
            ]
          });
          return true;
        } catch (addError) {
          console.error("Error adding BSC Testnet network", addError);
          return false;
        }
      } else {
        console.error("Error switching to BSC Testnet network", error);
        return false;
      }
    }
  };

  const handleConnectMetamask = async () => {
    if (window.ethereum) {
      try {
        const network = await web3.eth.net.getId();
        let switched = true;
        if (network !== 97) {
          switched = await switchToBSC();
        }

        if (switched) {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const address = accounts[0];
          setWalletAddress(address);
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Error connecting to Metamask", error);
      }
    } else {
      alert('Please install Metamask!');
    }
  };

  const handleDisconnectMetamask = async () => {
    try {
      await window.ethereum.request({ method: 'wallet_revokePermissions', params: [{ eth_accounts: {} }] });
      setWalletAddress('');
      setWalletBalance('');
      setIsConnected(false);
    } catch (error) {
      console.error("Error disconnecting from Metamask", error);
      toast.error('Error disconnecting from Metamask');
    }
  };

  const handleUpload = async () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
        const tokens = jsonData.map(row => row.tokens);
        console.log(tokens);
        setTransferWalletAddressFromExcel(jsonData.map(row => row.tokens));
  
        const amounts = jsonData.map(row => row.amount);
        console.log(amounts);
        setTransferAmountFromExcel(jsonData.map(row => row.amount));
  
        const hasEmptyValues = tokens.some(token => !token) || amounts.some(amount => !amount);
  
        if (hasEmptyValues) {
          toast.error("The Excel sheet contains empty values. Please fill all values before uploading.");
          return;
        }
  
        if (tokens.length === amounts.length) {
          setRowCount(tokens.length);
          const totalAmount = amounts.reduce((sum, value) => sum + value, 0);
          setRowAmount(totalAmount);
          setShowPopup(true);
        } else {
          toast.error("Number of rows in 'tokens' and 'amount' columns do not match.");
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }; 
  
  const handleConfirmUpload = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      fetch('/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Data successfully uploaded:', data);
          toast.success('Data uploaded successfully');
        })
        .catch((error) => {
          console.error('Error uploading data:', error);
          toast.error('Error uploading data');
        });
    };
    reader.readAsArrayBuffer(file);
    handleTransferTokenFromExcel();
    setShowPopup(false);
  };
  

  const handleCancelUpload = () => {
    toast.error('File submission canceled');
    setShowPopup(false);
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <ToastContainer />
      <h1 className='text-center font-bold mt-10'>Connect only BNB Testnet network wallet</h1>
      <div className='flex flex-col gap-4 flex-1 mt-5'>
        {isConnected ? (
          <button
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95'
            onClick={handleDisconnectMetamask}
          >
            Disconnect Metamask
          </button>
        ) : (
          <button
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95'
            onClick={handleConnectMetamask}
          >
            Connect Metamask
          </button>
        )}
      </div>
      <div className='flex flex-col gap-4 flex-1 mt-5'>
        <p>Wallet Address: {walletAddress}</p>
      </div>
      <div className='flex flex-col gap-4 flex-1 mt-5'>
        <p>Wallet Balance: {walletBalance} USDT</p>
      </div>

      {isConnected && (
        <div className="flex gap-4 mt-5">
          <input
            className='p-3 border border-gray-300 rounded w-full focus:outline-none'
            type="file"
            id='excel'
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            ref={fileRef}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            className='p-3 bg-blue-500 text-white rounded-lg uppercase hover:opacity-95'
            onClick={handleUpload}
          >
            Upload File
          </button>
        </div>
      )}

      {showPopup && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-60'>
          <div className='bg-white p-6 rounded-lg shadow-lg max-w-sm w-full'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Upload Confirmation</h2>
            <p className='text-gray-700 mb-2'><span className='font-medium'>Number of Tokens :</span> {rowCount}</p>
            <p className='text-gray-700 mb-4'><span className='font-medium'>Total Sum of Amount :</span> {rowAmount}</p>
            <div className='flex justify-end gap-3'>
              <button
                className='px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition'
                onClick={handleConfirmUpload}
              >
                Confirm
              </button>
              <button
                className='px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition'
                onClick={handleCancelUpload}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* <div className='flex gap-2 flex-1 mt-5'>
        <input
          type="text"
          placeholder='Wallet Address'
          onChange={(e) => setTransferWalletAddress(e.target.value)}
          value={transferWalletAddress}
          id='walletaddress'
          className='border w-60 p-3 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
        />
        <input
          type="text"
          placeholder='Amount'
          onChange={(e) => setTransferAmount(e.target.value)}
          value={transferAmount}
          id='amount'
          className='border w-60 p-3 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
        />
      </div>

      <div className='flex flex-col gap-4 flex-1 mt-5'>
        <button
          type='submit'
          onClick={handleTransferToken}
          className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95'
        >
          Submit
        </button>
      </div> */}

    </div>
  );
}
