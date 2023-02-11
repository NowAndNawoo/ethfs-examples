import { TransactionRequest } from '@ethersproject/abstract-provider';
import { Deferrable } from 'ethers/lib/utils';
import { ethers } from 'hardhat';
import { getEnvValue, waitTx } from '../lib/common';

const main = async () => {
  const hash = getEnvValue('HASH');
  const gasPrice = getEnvValue('GAS_PRICE');

  const [signer] = await ethers.getSigners();

  const currentTransaction = await ethers.provider.getTransaction(hash);
  const request: Deferrable<TransactionRequest> = {
    type: 0,
    from: currentTransaction.from,
    gasPrice: ethers.utils.parseUnits(gasPrice, 'gwei'),
    gasLimit: currentTransaction.gasLimit,
    to: currentTransaction.to,
    value: currentTransaction.value,
    nonce: currentTransaction.nonce,
    data: currentTransaction.data,
  };
  const tx = await signer.sendTransaction(request);
  await waitTx('speedUp', tx);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
