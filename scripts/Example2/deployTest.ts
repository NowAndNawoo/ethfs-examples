import { base64 } from 'ethers/lib/utils';
import { writeFileSync } from 'fs';
import { ethers } from 'hardhat';
import { DATAURL_PREFIX_JPEG_B64, DATAURL_PREFIX_JSON_B64, FILE_STORE_CA_GOERLI } from '../constants';
import { waitDeployed, waitTx } from '../lib/common';

async function main() {
  // signer
  const [signer] = await ethers.getSigners();
  console.log('signer:', signer.address);

  // deploy Example2
  const contract = await ethers.getContractFactory('Example2').then((factory) => factory.deploy(FILE_STORE_CA_GOERLI));
  await waitDeployed('Example2', contract);

  // mint
  const tx = await contract.mint(
    1,
    'Moon',
    'This image file is not Base64 encoded and is stored using EthFS.',
    'moon.jpg'
  );
  await waitTx('mint', tx);

  // estimateGas
  const gas = await contract.estimateGas.tokenURI(1);
  console.log('estimateGas:', gas.toNumber()); // 9352343

  // tokenURI
  const uri = await contract.tokenURI(1);

  // get metadata
  const json = new TextDecoder().decode(base64.decode(uri.slice(DATAURL_PREFIX_JSON_B64.length)));
  const tokenMetadata = JSON.parse(json);
  writeFileSync('./output/Example2_metadata.json', json);

  // get image
  const jpg = base64.decode(tokenMetadata.image.slice(DATAURL_PREFIX_JPEG_B64.length));
  writeFileSync('./output/Example2_image.jpg', jpg);

  console.log('done!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
