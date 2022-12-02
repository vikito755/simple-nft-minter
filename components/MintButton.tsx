import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  PaperProps,
  Button,

} from '@mantine/core';
import { FC } from 'react';
import mintNft from '../blockchain/mintNft';


interface mintingProps {
    address: string;
    nftName: string;
    imageUrl: string;
};


const MintingButton: FC<mintingProps> = (props: mintingProps) => {

  return (
          <Button onClick={ async () => {
              mintNft( props.address, props.nftName, props.imageUrl)}} type="submit" fullWidth>Mint</Button>
  );
}

export default MintingButton;