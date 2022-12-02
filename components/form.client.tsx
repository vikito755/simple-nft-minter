import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
} from '@mantine/core';
import { FC } from 'react';
import mintNft from '../blockchain/mintNft';
import { ethers } from 'ethers';
import dynamic from 'next/dynamic';
const MintingButton = dynamic(import('../components/MintButton'), {ssr: false})

const MintingForm: FC = (props: PaperProps) => {
  const form = useForm({
    initialValues: {
      address: '',
      imageUrl: '',
      nftName: ''
    },

    validate: {
    //   address: (val) => (ethers.utils.isAddress(val) ? null : 'Invalid email'),
    //   password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  return (
    <Paper style={{width: '100vw'}} radius="md" p="xl" withBorder {...props}>
      <Text size="lg" weight={500}>
        Welcome to Simple Nft Minter on Goerli Testnet.
      </Text>

      <Divider label="Set your network to Goerli tesnet and unlock your wallet." labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(() => {})}>
        <Stack>

          <TextInput
            required
            label="address"
            placeholder="0x123..."
            value={form.values.address}
            onChange={(event) => form.setFieldValue('address', event.currentTarget.value)}
            error={form.errors.address && 'Invalid address'}
          />

            <TextInput
            required
            label="image URL"
            placeholder="https://url-to-your-image"
            value={form.values.imageUrl}
            onChange={(event) => form.setFieldValue('imageUrl', event.currentTarget.value)}
            error={form.errors.imageUrl && 'Invalid imageUrl'}
          />

          <TextInput
            required
            label="NFT name"
            placeholder="Determined Squirrel Buddies"
            value={form.values.nftName}
            onChange={(event) => form.setFieldValue('nftName', event.currentTarget.value)}
            error={form.errors.nftName && 'Invalid nft name'}
          />
        </Stack>

        <Group position="apart" mt="xl">
          <MintingButton address={form.values.address}
           nftName={form.values.nftName}
            imageUrl={form.values.imageUrl}></MintingButton>
        </Group>
      </form>
    </Paper>
  );
}

export default MintingForm;