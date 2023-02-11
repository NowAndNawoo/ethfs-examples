import { TransactionRequest } from '@ethersproject/abstract-provider';
import { Deferrable } from 'ethers/lib/utils';
import { getEnvValue, getEnvValueAsNumber, waitTx } from '../lib/common';
import { ethers } from 'hardhat';

const main = async () => {
  const nonce = getEnvValueAsNumber('NONCE');
  const gasPrice = getEnvValue('GAS_PRICE');

  const [signer] = await ethers.getSigners();
  const request: Deferrable<TransactionRequest> = {
    to: signer.address,
    value: 0,
    nonce,
    type: 0,
    gasPrice: ethers.utils.parseUnits(gasPrice, 'gwei'),
  };
  const tx = await signer.sendTransaction(request);
  await waitTx('cancel', tx);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
