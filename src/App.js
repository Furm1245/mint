import { useState, useEffect } from 'react'
import { initOnboard } from './utils/onboard'
import { useConnectWallet, useSetChain, useWallets } from '@web3-onboard/react'
import { config } from './dapp.config'
import {
  getTotalMinted,
  getMaxSupply,
  isPausedState,
  isPublicSaleState,
  isPreSaleState,
  presaleMint,
  publicMint
} from './utils/interact'


function App() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const connectedWallets = useWallets()
  const [onboard, setOnboard] = useState(null)

  const [maxSupply, setMaxSupply] = useState(0)
  const [totalMinted, setTotalMinted] = useState(0)
  const [maxMintAmount, setMaxMintAmount] = useState(0)
  const [paused, setPaused] = useState(false)
  const [isPublicSale, setIsPublicSale] = useState(false)
  const [isPreSale, setIsPreSale] = useState(false)

  const [status, setStatus] = useState(null)
  const [mintAmount, setMintAmount] = useState(1)
  const [isMinting, setIsMinting] = useState(false)


  useEffect(() => {
    setOnboard(initOnboard)
  }, [])

  useEffect(() => {
    if (!connectedWallets.length) return

    const connectedWalletsLabelArray = connectedWallets.map(
      ({ label }) => label
    )
    window.localStorage.setItem(
      'connectedWallets',
      JSON.stringify(connectedWalletsLabelArray)
    )
  }, [connectedWallets])

  useEffect(() => {
    if (!onboard) return

    const previouslyConnectedWallets = JSON.parse(
      window.localStorage.getItem('connectedWallets')
    )

    if (previouslyConnectedWallets?.length) {
      async function setWalletFromLocalStorage() {
        await connect({
          autoSelect: {
            label: previouslyConnectedWallets[0],
            disableModals: true
          }
        })
      }

      setWalletFromLocalStorage()
    }
  }, [onboard, connect])

  useEffect(() => {
    const init = async () => {
      setMaxSupply(await getMaxSupply())
      setTotalMinted(await getTotalMinted())

      setPaused(await isPausedState())
      setIsPublicSale(await isPublicSaleState())
      const isPreSale = await isPreSaleState()
      setIsPreSale(isPreSale)

      setMaxMintAmount(
        isPreSale ? config.presaleMaxMintAmount : config.maxMintAmount
      )
    }

    init()
  }, [])

  const incrementMintAmount = () => {
    if (mintAmount < maxMintAmount) {
      setMintAmount(mintAmount + 1)
    }
  }

  const decrementMintAmount = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1)
    }
  }

  const presaleMintHandler = async () => {
    setIsMinting(true)

    const { success, status } = await presaleMint(mintAmount)

    setStatus({
      success,
      message: status
    })

    setIsMinting(false)
  }
  const publicMintHandler = async () => {
    setIsMinting(true)

    const { success, status } = await publicMint(mintAmount)

    setStatus({
      success,
      message: status
    })

    setIsMinting(false)
  }

  return (
    <div >
      <div>

        <div>
          <div>
            {wallet && (
              <button
                onClick={() =>
                  disconnect({
                    label: wallet.label
                  })
                }
              >
                Disconnect
              </button>
            )}
            <h1>
              {paused ? 'Paused' : isPreSale ? 'Pre-Sale' : 'Public Sale'}
            </h1>
            <h3>
              {wallet?.accounts[0]?.address
                ? wallet?.accounts[0]?.address.slice(0, 8) +
                '...' +
                wallet?.accounts[0]?.address.slice(-4)
                : ''}
            </h3>

            <div>
              <div>
                <div>
                  <p>
                    <span>{totalMinted}</span> /{' '}
                    {maxSupply}
                  </p>
                </div>
              </div>

              <div>
                <div>
                  <button
                    onClick={incrementMintAmount}
                  >
                  </button>

                  <p>
                    {mintAmount}
                  </p>

                  <button

                    onClick={decrementMintAmount}
                  >

                  </button>
                </div>

                <p>
                  Max Mint Amount: {maxMintAmount}
                </p>

                <div>
                  <div >
                    <p>Total</p>

                    <div >
                      <p>
                        {Number.parseFloat(config.price * mintAmount).toFixed(
                          2
                        )}{' '}
                        ETH
                      </p>{' '}
                      <span >+ GAS</span>
                    </div>
                  </div>
                </div>

                {/* Mint Button && Connect Wallet Button */}
                {wallet ? (
                  <button
                    // className={` ${
                    //   paused || isMinting
                    //     ? 'bg-gray-900 cursor-not-allowed'
                    //     : 'bg-gradient-to-br from-brand-purple to-brand-pink shadow-lg hover:shadow-pink-400/50'
                    // } font-coiny mt-12 w-full px-6 py-3 rounded-md text-2xl text-white  mx-4 tracking-wide uppercase`}
                    disabled={paused || isMinting}
                    onClick={isPreSale ? presaleMintHandler : publicMintHandler}
                  >
                    {isMinting ? 'Minting...' : 'Mint'}
                  </button>
                ) : (
                  <button
                    onClick={() => connect()}
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>

            {/* Status */}
            {/* {status && (
              <div
                className={`border ${
                  status.success ? 'border-green-500' : 'border-brand-pink-400 '
                } rounded-md text-start h-full px-4 py-4 w-full mx-auto mt-8 md:mt-4"`}
              >
                <p className="flex flex-col space-y-2 text-white text-sm md:text-base break-words ...">
                  {status.message}
                </p>
              </div>
            )} */}

            {/* Contract Address */}
            <div >
              <h3 >
                Contract Address
              </h3>
              <a
                href={`https://rinkeby.etherscan.io/address/${config.contractAddress}#readContract`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{config.contractAddress}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
