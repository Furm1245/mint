

import { init } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'


const RPC_URL = process.env.REACT_APP_RINKEBY_RPC_URL

const injected = injectedModule()

const initOnboard = init({
    wallets: [injected],
    chains: [
        // {
        //   id: '0x1',
        //   token: 'ETH',
        //   label: 'Ethereum Mainnet',
        //   rpcUrl: 'https://mainnet.infura.io/v3/ababf9851fd845d0a167825f97eeb12b'
        // },
        {
            id: '0x4',
            token: 'rETH',
            label: 'Ethereum Rinkeby Testnet',
            rpcUrl: RPC_URL
        }
        // {
        //   id: '0x89',
        //   token: 'MATIC',
        //   label: 'Matic Mainnet',
        //   rpcUrl: 'https://matic-mainnet.chainstacklabs.com'
        // }
    ],
    appMetadata: {
        name: 'RoboDucks',
        icon: 'an icon',
        description: 'We are some Robo Ducks',
        recommendedInjectedWallets: [
            { name: 'MetaMask', url: 'https://metamask.io' }
        ],
        agreement: {
            version: '1.0.0',
            termsUrl: 'https://www.blocknative.com/terms-conditions',
            privacyUrl: 'https://www.blocknative.com/privacy-policy'
        },
        gettingStartedGuide: 'https://blocknative.com',
        explore: 'https://blocknative.com'
    }
})

export { initOnboard }