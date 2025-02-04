import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, Chain, goerli, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { JoyIdConnector } from '@joyid/wagmi';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import React from "react";
import JoyidURL from "../utils/joyidURL";
import { USE_NETWORK } from "utils/constant";


const APP_NAME = 'SeeDAO';
const APP_ICON = `${window.location.origin}/icon192.png`;

export default function WagmiProvider(props: React.PropsWithChildren) {
  const supportChains: Chain[] = [mainnet, polygon, goerli, sepolia];
  // switch (networkConfig.chainId) {
  //   case 1:
  //     supportChains = [mainnet, goerli];
  //     break;
  //   case 137:
  //     supportChains = [mainnet, polygon, goerli, sepolia];
  //     break;
  //   default:
  //     throw new Error(`[config] Unsupported chainId:${networkConfig.chainId}`);
  // }

  const { chains, publicClient } = configureChains(supportChains, [publicProvider()]);

  // const unipass = new UniPassConnector({
  //   options: {
  //     chainId: supportChains[0].id,
  //     returnEmail: false,
  //     appSettings: {
  //       appName: APP_NAME,
  //       appIcon: APP_ICON,
  //     },
  //   },
  // });

  const JOY_ID_URL =JoyidURL[USE_NETWORK];

  const joyidConnector = new JoyIdConnector({
    chains,
    options: {
      name: APP_NAME,
      logo: APP_ICON,
      joyidAppURL: JOY_ID_URL,
    },
  });

  const config = createConfig({
    autoConnect: true,
    connectors: [
      new InjectedConnector({
        chains,
        options: {
          shimDisconnect: false,
        },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          showQrModal: true,
          projectId:"bfa9036cfdc020f867087ce4cadffe13",
          qrModalOptions:{
            themeVariables:{
              "--wcm-z-index": "9999999999999"
            }
          }
        },
      }),
      joyidConnector,
      // unipass,
    ],
    publicClient,
  });

  return <WagmiConfig config={config}>{props.children}</WagmiConfig>;
}
