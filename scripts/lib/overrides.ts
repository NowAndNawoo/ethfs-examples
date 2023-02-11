import { Overrides } from 'ethers';
import { getEnvValue } from './common';
import fetch from 'node-fetch';

const apiKey = getEnvValue('OWLRACLE_API_KEY');

export async function getEIP1559Overrides(): Promise<Overrides> {
  // MEMO: owlracleの返すgasがwei以下の小数になる場合があるのでweiで取得 (1.1836425659999998 gwei → 1183642565.99999998 wei)
  const res = await fetch(`https://api.owlracle.info/v3/goerli/gas?apikey=${apiKey}&reportwei=true`);
  const data: any = await res.json();
  const maxFeePerGas = data.speeds[2].maxFeePerGas; // 0:slow,1:normal,2:fast,3:instant
  const maxPriorityFeePerGas = data.speeds[2].maxPriorityFeePerGas;
  console.log({ maxFeePerGas, maxPriorityFeePerGas });
  return {
    type: 2,
    maxFeePerGas,
    maxPriorityFeePerGas,
  };
}
