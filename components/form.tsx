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

const MintingForm: FC = (props: PaperProps) => {
  const form = useForm({
    initialValues: {
      address: '',
      imageUrl: '',
      nftName: '',
      traitOne: '',
      traitTwo: '',
      traitThree: '',
      traitFour: ''
    },

    validate: {
    //   address: (val) => (ethers.utils.isAddress(val) ? null : 'Invalid email'),
    //   password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
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
{/* Trait type names */}
          <TextInput
            required
            label="Trait Type One"
            placeholder="Fur"
            value={form.values.traitOne}
            onChange={(event) => form.setFieldValue('traitOne', event.currentTarget.value)}
            error={form.errors.traitOnee && 'Invalid trait type one'}
          />

<TextInput
            required
            label="Trait Type Two"
            placeholder="Accessories"
            value={form.values.traitTwo}
            onChange={(event) => form.setFieldValue('traitTwo', event.currentTarget.value)}
            error={form.errors.traitTwoe && 'Invalid trait type two'}
          />

<TextInput
            required
            label="Trait Type Three"
            placeholder="Mouth"
            value={form.values.traitThree}
            onChange={(event) => form.setFieldValue('traitThree', event.currentTarget.value)}
            error={form.errors.traitThree&& 'Invalid trait type three'}
          />

<TextInput
            required
            label="Trait Type Four"
            placeholder="Eyes"
            value={form.values.traitFour}
            onChange={(event) => form.setFieldValue('traitFour', event.currentTarget.value)}
            error={form.errors.traitFour && 'Invalid trait type four'}
          />
        </Stack>

        <Group position="apart" mt="xl">
          
          <Button onClick={ async () => {
            const mintNft = (
                await import('../blockchain/mintNft')
              ).default;
              mintNft(form.values.address, form.values.nftName, form.values.imageUrl, 
                form.values.traitOne,
                form.values.traitTwo,
                form.values.traitThree,
                form.values.traitFour
              )}} type="submit" fullWidth>Mint</Button>
        </Group>
      </form>
    </Paper>
  );
}

export default MintingForm;