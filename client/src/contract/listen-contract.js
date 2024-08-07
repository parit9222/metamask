import { ethers } from 'ethers';
import stakeContractABI from '../abi/contractAbi.json';

const tokenAddress = '0xeB5e838Ee0EA3E1de58451A09eb032EDE31C79c7';

export const tokenContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(tokenAddress, stakeContractABI, signer);
    // const contract = new ethers.Contract(tokenAddress, stakeContractABI, provider);
    // const contract = new ethers.Contract(tokenAddress, stakeContractABI, provider.getSigner());
    // console.log(contract);
    return contract;
};














// import {ethers} from 'ethers';
// import stakeContractABI from '../abi/contractAbi.json';
// const tokenAddress = '0xeB5e838Ee0EA3E1de58451A09eb032EDE31C79c7';
// export const tokenContract = async () => {
//     // let provider = new ethers.providers.Web3Provider(window?.ethereum);
//     let provider = new ethers.providers.Web3Provider(window?.ethereum);

//     const contract = new ethers.Contract(tokenAddress, stakeContractABI, provider.getSigner());
//     console.log(contract);
//     return contract;
// };

// export const  sendTokens = async() => {

//     if (amount && senderAddresses.length > 0) {
//       const totalAmount = amount;
//       const splitAmount = totalAmount / senderAddresses.length;
  
//       if (!web3 || !tokenContract) {
//         errorMessage = 'Web3 or token contract not initialized.';
//         return;
//       }
  
//       try {
//         const allowance = await tokenContract.methods.allowance(owner, spender).call();
//         console.log('Allowance:', allowance);
//         const tokenDecimalsBigInt = await tokenContract.methods.decimals().call();
//         const tokenDecimals = Number(tokenDecimalsBigInt);
//         console.log('tokenDecimals', tokenDecimals);
  
//         // const factor = BigInt(10) ** BigInt(tokenDecimals);
//         const amountToSend = (BigInt(Math.floor(splitAmount * Math.pow(10, tokenDecimals)))).toString();
        
//         console.log('amountToSend', amountToSend);
  
//         const tokenBalanceInSmallestUnit = await tokenContract.methods.balanceOf(walletAddress).call();
//         const tokenBalance = parseFloat(tokenBalanceInSmallestUnit) / Math.pow(10, tokenDecimals);
//         console.log('tokenBalance', tokenBalance);
  
//         if (tokenBalance < totalAmount) {
//           errorMessage = `Insufficient balance. Your balance is ${tokenBalance} tokens.`;
//           return;
//         }
  
//         Spinnerloading = true;
  
//         const transactionPromises = senderAddresses.map(async (address) => {
//           try {
//             const receipt = await tokenContract.methods.transfer(address, amountToSend).send({ from: walletAddress });
//             console.log("amountToSend (in smallest unit)", amountToSend);
//             console.log(`Successfully sent ${splitAmount} tokens to ${address}`);
//             console.log("receipt", receipt);
//             return receipt;
//           } catch (error) {
//             console.error(`Failed to send tokens to ${address}`, error);
//             throw error;
//           }
//         });
  
//         try {
//           const receipts = await Promise.all(transactionPromises);
//           messageService.add({ severity: 'success', detail: `Token Sent Successfully` });
//           resetForm();
//         } catch (error) {
//           console.error('Error in sending tokens to one or more addresses', error);
//           messageService.add({ severity: 'error', detail: `Failed to send tokens to one or more addresses` });
//         } finally {
//           Spinnerloading = false;
//         }
  
//         errorMessage = null;
//       } catch (error) {
//         console.error('Failed to execute token transfer', error);
//         messageService.add({ severity: 'error', detail: `Failed to execute token transfer` });
//       }
//     } else {
//       errorMessage = 'Please enter a valid amount and at least one recipient address.';
//     }
//   }


