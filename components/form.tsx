import { useState } from 'react';
import {
  TextInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Stack,
} from '@mantine/core';
import { FC } from 'react';
// import mintNft from '../blockchain/mintNft';
import { ethers } from 'ethers';
import { useForm } from '@mantine/form';
import mintNft from '../blockchain/mintNft';

interface Trait {
  name: string;
  value: string;
}

const MintingForm: FC = (props: PaperProps) => {
  const [traits, setTraits] = useState<Trait[]>([]);
  const form = useForm({
    initialValues: {
      address: '',
      imageUrl: '',
      nftName: '',
      traits: {},
    },
    validate: {
      address: (val) => (ethers.utils.isAddress(val) ? null : 'Invalid address'),
      imageUrl: (val) => (val.startsWith('http') ? null : 'Invalid image URL'),
      nftName: (val) => (val.length > 0 ? null : 'NFT name is required'),
    },
  });

  const addTraitField = () => {
    setTraits((prevTraits) => [...prevTraits, { name: '', value: '' }]);
  };

  const removeTraitField = (index: number) => {
    setTraits((prevTraits) => {
      const newTraits = [...prevTraits];
      newTraits.splice(index, 1);
      return newTraits;
    });
  };

  const handleTraitChange = (index: number, field: keyof Trait, value: string) => {
    setTraits((prevTraits) => {
      const newTraits = [...prevTraits];
      newTraits[index][field] = value;
      return newTraits;
    });
  };

  const handleSubmit = async () => {
    const traitNames = traits.map((traitName, index) => `Trait ${index + 1}`);
    const traitValues = traits.map((trait) => trait.value);
    await mintNft(
      form.values.address,
      form.values.nftName,
      form.values.imageUrl,
      traitNames,
      traitValues
    );
  };

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" weight={500}>
        Welcome to Simple Nft Minter on Sepolia Testnet.
      </Text>

      <Divider
        label="Set your network to Sepolia tesnet and unlock your wallet."
        labelPosition="center"
        my="lg"
      />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            required
            label="Address"
            placeholder="0x123..."
            value={form.values.address}
            onChange={(event) => form.setFieldValue('address', event.currentTarget.value)}
            error={form.errors.address && 'Invalid address'}
          />

          <TextInput
            required
            label="Image URL"
            placeholder="https://url-to-your-image"
            value={form.values.imageUrl}
            onChange={(event) => form.setFieldValue('imageUrl', event.currentTarget.value)}
            error={form.errors.imageUrl && 'Invalid image URL'}
          />

          <TextInput
            required
            label="NFT name"
            placeholder="Determined Squirrel Buddies"
            value={form.values.nftName}
            onChange={(event) => form.setFieldValue('nftName', event.currentTarget.value)}
            error={form.errors.nftName && 'Invalid NFT name'}
          />

          {traits.map((trait, index) => (
            <div key={index}>
              <TextInput
                required
                label={`Trait Type ${index + 1}`}
                placeholder="Enter trait type"
                value={trait.name}
                onChange={(event) =>
                  handleTraitChange(index, 'name', event.currentTarget.value)
                }
                error={form.errors[`trait_${index}`] && `Invalid trait type ${index + 1}`}
              />

              <TextInput
                required
                label={`Trait Value ${index + 1}`}
                placeholder="Enter trait value"
                value={trait.value}
                onChange={(event) =>
                  handleTraitChange(index, 'value', event.currentTarget.value)
                }
                error={form.errors[`trait_${index}`] && `Invalid trait value ${index + 1}`}
              />

              <Button
                variant="outline"
                color="red"
                onClick={() => removeTraitField(index)}
              >
                Remove Trait
              </Button>
            </div>
          ))}
        </Stack>

        <Group position="apart" mt="xl">
          <Button onClick={addTraitField} type="button">
            Add Trait Field
          </Button>
          <Button onClick={handleSubmit} type="submit" fullWidth>
            Mint
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default MintingForm;
