import { ethers } from "ethers";
import toast from "react-hot-toast";
import smartContractAbi from "./smartContractAbi"

// Not important to the mint when testing.
const arbitraryUri = '0';
const nftQuantity = '1';
const mintContractAddress = "0xD4B4B14901F45C019F6A925d769dDAe67492915f";


const mintNft = async (_mintNftTo: string, _nftTitle: string, _imageUrl: string, 
  _traitKeys: string[],
  _traitValues: string[]
  ) => {


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
    
          await nftContract["safeMint(address,string,string,string,string,string[],string[],uint8)"](
            _mintNftTo,
            arbitraryUri,
            _nftTitle,
            _nftTitle,
            _imageUrl,
            _traitKeys,
            _traitValues,
            nftQuantity
          );
        }
        catch {
            toast.error('Failed to mint an NFT.')
        };
}

export default mintNft;