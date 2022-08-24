var Marketplace = artifacts.require("Marketplace");
var NFT = artifacts.require("NFT");

module.exports = function(deployer) {
  deployer.deploy(NFT);
  deployer.deploy(Marketplace, 3);
};