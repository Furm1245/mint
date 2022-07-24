require("@nomiclabs/hardhat-waffle")
const hre = require("hardhat");
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const whitelist = require('./whitelist.js')

const BASE_URI = 'ipfs://QmXr3bfVTndYLUAovCZSKAn8AfCkfQNCw89JVTcUBYEvbx/'
const proxyRegistryAddressRinkeby = '0xf57b2c51ded3a29e6891aba85459d600256cf317'
const proxyRegistryAddressMainnet = '0xa5409ec958c83c3f309868babaca7c86dcb077c1'


async function main() {
  // Calculate merkle root from the whitelist array
  const leafNodes = whitelist.map((addr) => keccak256(addr))
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
  const root = merkleTree.getRoot()


  const RoboDucksNFT = await hre.ethers.getContractFactory("RoboDucksNFT");
  const roboducksNFT = await RoboDucksNFT.deploy(
    BASE_URI,
    root,
    proxyRegistryAddressRinkeby
  );

  await roboducksNFT.deployed();

  console.log("RoboDucksNFT deployed to:", roboducksNFT.address);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
