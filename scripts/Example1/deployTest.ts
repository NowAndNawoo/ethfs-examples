import { base64 } from 'ethers/lib/utils';
import { writeFileSync } from 'fs';
import { ethers } from 'hardhat';
import { DATAURL_PREFIX_JPEG_B64, DATAURL_PREFIX_JSON_B64, FILE_STORE_CA_GOERLI } from '../constants';
import { waitDeployed, waitTx } from '../lib/common';

async function main() {
  // signer
  const [signer] = await ethers.getSigners();
  console.log('signer:', signer.address);

  // deploy Example1
  const contract = await ethers.getContractFactory('Example1').then((factory) => factory.deploy(FILE_STORE_CA_GOERLI));
  await waitDeployed('Example1', contract);

  // mint
  const tx = await contract.mint(1, 'Earth', 'This image file is Base64 encoded and stored using EthFS.', 'earth.jpg');
  await waitTx('mint', tx);

  // estimateGas
  const gas = await contract.estimateGas.tokenURI(1);
  console.log('estimateGas:', gas.toNumber()); // 5730006

  // tokenURI
  const uri = await contract.tokenURI(1);

  // get metadata
  const json = new TextDecoder().decode(base64.decode(uri.slice(DATAURL_PREFIX_JSON_B64.length)));
  const tokenMetadata = JSON.parse(json);
  writeFileSync('./output/Example1_metadata.json', json);

  // get image
  const jpg = base64.decode(tokenMetadata.image.slice(DATAURL_PREFIX_JPEG_B64.length));
  writeFileSync('./output/Example1_image.jpg', jpg);

  console.log('done!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
