var Marketplace = artifacts.require("Marketplace");
var NFT = artifacts.require("NFT");

module.exports = function(deployer) {
  deployer.deploy(NFT);
  deployer.link(NFT, Marketplace);
  deployer.deploy(Marketplace);
};