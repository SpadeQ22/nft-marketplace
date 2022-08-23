/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * https://trufflesuite.com/docs/truffle/reference/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

require('dotenv').config();
// const mnemonic = process.env["MNEMONIC"];
// const infuraProjectId = process.env["INFURA_PROJECT_ID"];
 
const HDWalletProvider = require('@truffle/hdwallet-provider');
const privateKeyTest = process.env.PRIVATE_KEY;

module.exports = {
  networks: {
    testnet: {
      provider: () => {
        if (!privateKeyTest.trim()) {
          throw new Error(
            'Please provide a private key with funds'    
          );
        }
        return new HDWalletProvider({
          privateKeys: [privateKeyTest],
          providerOrUrl: 'https://arctic-rpc.icenetwork.io:9933',
        });
      },
      network_id: 552,
      timeoutBlocks: 100 // To avoid quick timeouts
    },
  },
  compilers: {
    solc: {
      version: "^0.8.0"  // ex:  "0.4.20". (Default: Truffle's installed solc)
    }
  }
};

