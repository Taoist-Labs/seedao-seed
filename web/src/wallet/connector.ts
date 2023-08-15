import { MetaMask } from "@web3-react/metamask";
import { initializeConnector } from "@web3-react/core";
import { Wallet } from "./wallet";
import { UniPass } from "@unipasswallet/web3-react";

function onError(error: Error) {
  console.debug(`web3-react error: ${error}`);
}

export const [injected, injectedHooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions, onError }),
);

export const [uniPassWallet, uniPassHooks] = initializeConnector<UniPass>(
  (actions) =>
    new UniPass({
      actions,
      options: {
        chainId: 137,
        returnEmail: true,
        rpcUrls: {
          mainnet:
            "https://eth-mainnet.g.alchemy.com/v2/YuNeXto27ejHnOIGOwxl2N_cHCfyLyLE",
          polygon: "https://polygon.llamarpc.com",
        },
        appSettings: {
          appName: "SeeDAO Seed",
        },
      },
    }),
);

export const getConnectorForWallet = (wallet: Wallet) => {
  switch (wallet) {
    case Wallet.METAMASK:
      return injected;
    case Wallet.UNIPASS:
      return uniPassWallet;
    default:
      return;
  }
};

export const SELECTABLE_WALLETS = [Wallet.METAMASK];

export const useConnectors = () => {
  return [
    [injected, injectedHooks],
    [uniPassWallet, uniPassHooks],
  ];
};
