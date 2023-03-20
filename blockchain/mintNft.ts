import { ethers } from "ethers";
import toast from "react-hot-toast";
import smartContractAbi from "./smartContractAbi"

// Not important to the mint when testing.
const arbitraryUri = '0';
const nftQuantity = '1';
const mintContractAddress = "0xF0F265c5eFDfB14a87151284025ffa88E256bD8F";


const mintNft = async (_mintNftTo: string, _nftTitle: string, _imageUrl: string) => {


    try {
        const cryptoWindow: any = window;
        const metamaskProvider = new ethers.providers.Web3Provider(
          cryptoWindow.ethereum
        );

        await metamaskProvider.send('eth_requestAccounts', []);
    
          const signer = await metamaskProvider.getSigner();
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
}

export default mintNft;