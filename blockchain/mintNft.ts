import { ethers } from "ethers";
import toast from "react-hot-toast";
import smartContractAbi from "./smartContractAbi"

// Not important to the mint when testing.
const arbitraryUri = '0';
const nftQuantity = '1';
const mintContractAddress = "0x4f4CEaF730659babA7f1Ae8D4347c1102Ec5fe36";
const randomWalletAddress = "0x60C9040c4809c1fC34247bC94683717377c5FAE2";

const mintNft = async (_mintNftTo: string, _nftTitle: string, _imageUrl: string) => {


    try {
        const cryptoWindow: any = window;
        const metamaskProvider = new ethers.providers.Web3Provider(
          cryptoWindow.ethereum
        );
        await metamaskProvider.send('eth_requestAccounts', []); // <- this promps user to connect metamask

          const signer = await metamaskProvider.getSigner(randomWalletAddress);
          const nftContract = await new ethers.Contract(
            mintContractAddress,
            smartContractAbi,
            signer
          );
    
          await nftContract["safeMint(address,string,string,string,string,uint8)"](
            _mintNftTo,
            arbitraryUri,
            _nftTitle,
            _nftTitle,
            _imageUrl,
            nftQuantity
          );
        }
        catch {
            toast.error('Failed to mint an NFT.')
        };

export default mintNft;