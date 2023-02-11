import { ethers, network } from 'hardhat';
import { FILE_STORE_CA_GOERLI } from '../constants';
import { waitDeployed, waitTx } from '../lib/common';

async function main() {
  if (network.name !== 'goerli') throw Error('Invalid network');

  // get signer
  const [signer] = await ethers.getSigners();
  console.log('signer:', signer.address);

  // deploy
  const contract = await ethers.getContractFactory('Example2').then((factory) => factory.deploy(FILE_STORE_CA_GOERLI));
  await waitDeployed('Example2', contract);

  // mint
  const txMint = await contract.mint(
    1,
    'Moon',
    'This image file is not Base64 encoded and is stored using EthFS.',
    'moon.jpg'
  );
  await waitTx('mint', txMint);

  console.log('done!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
