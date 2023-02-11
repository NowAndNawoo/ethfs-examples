import { ethers, network } from 'hardhat';
import { FILE_STORE_CA_GOERLI } from '../constants';
import { waitDeployed, waitTx } from '../lib/common';

async function main() {
  if (network.name !== 'goerli') throw Error('Invalid network');

  // get signer
  const [signer] = await ethers.getSigners();
  console.log('signer:', signer.address);

  // deploy
  const contract = await ethers.getContractFactory('Example1').then((factory) => factory.deploy(FILE_STORE_CA_GOERLI));
  await waitDeployed('Example1', contract);

  // mint
  const tx = await contract.mint(1, 'Earth', 'This image file is Base64 encoded and stored using EthFS.', 'earth.jpg');
  await waitTx('mint', tx);

  console.log('done!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
