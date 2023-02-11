import { ethers } from 'hardhat';
import { waitDeployed, waitTx } from './lib/common';

async function main() {
  // signer
  const [signer] = await ethers.getSigners();
  console.log('signer:', signer.address);

  // deploy
  const contract = await ethers.getContractFactory('Example1').then((factory) => factory.deploy());
  await waitDeployed('Example1', contract);

  // mint
  const txMint = await contract.mint(1);
  await waitTx('mint', txMint);

  // estimateGas
  const gas = await contract.estimateGas.tokenURI(1);
  console.log('estimateGas:', gas.toNumber());

  console.log('done!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
