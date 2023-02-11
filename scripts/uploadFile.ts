import { readFileSync } from 'fs';
import { ethers, network } from 'hardhat';
import { FILE_STORE_CA_GOERLI } from './constants';
import { waitTx } from './lib/common';

async function main() {
  if (network.name !== 'goerli') throw Error('Invalid network');
  const fileStoreAddress = FILE_STORE_CA_GOERLI;

  // file info
  const filePath = './data/moon.jpg';
  const fileName = 'moon.jpg';
  const fileMetadata = { type: 'image/jpeg', license: 'CC0' };

  // get signer
  const [signer] = await ethers.getSigners();
  console.log('signer:', signer.address);

  // get contracts
  const fileStore = await ethers.getContractAt('FileStore', fileStoreAddress, signer);
  const contentStoreAddress = await fileStore.contentStore();
  const contentStore = await ethers.getContractAt('ContentStore', contentStoreAddress, signer);

  // add chunks
  const chunkSize = 24575; // 0x6000-1
  const buffer = readFileSync(filePath);
  const chunkCount = Math.ceil(buffer.length / chunkSize);
  const checksums: string[] = [];
  console.log({ chunkCount });
  for (let i = 0; i < chunkCount; i++) {
    const chunk = buffer.slice(chunkSize * i, chunkSize * (i + 1));
    const checksum = ethers.utils.keccak256(chunk);
    // const [checksum] = await contentStore.callStatic.addContent(chunk);
    checksums.push(checksum);
    console.log('checksum:', checksum);
    const exists = await contentStore.checksumExists(checksum);
    if (exists) {
      console.log('checksum exists');
    } else {
      const tx = await contentStore.addContent(chunk);
      await waitTx('addContent' + i, tx);
    }
  }

  // create file
  const extraData = ethers.utils.toUtf8Bytes(JSON.stringify(fileMetadata));
  const tx = await fileStore['createFile(string,bytes32[],bytes)'](fileName, checksums, extraData);
  await waitTx('createFile', tx);

  console.log('done!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
