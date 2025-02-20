import * as React from 'react';
import { usePublicClient, useWalletClient, PublicClient, WalletClient } from 'wagmi';
import { ethers } from 'ethers';
import { HttpTransport } from 'viem';
import Chain from "../utils/chain";
import {USE_NETWORK} from "../utils/constant";

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === "fallback")
    return new ethers.providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(({ value }) => {

        // return new ethers.providers.JsonRpcProvider(value?.url, network);
        let url = value?.url;
        if(value?.url === "https://cloudflare-eth.com"){
          url = Chain[USE_NETWORK].rpcUrls[0]
        }
        return new ethers.providers.JsonRpcProvider(url, network);
      }),
    );
  return new ethers.providers.JsonRpcProvider(transport.url, network);
}

/** Hook to convert a viem Public Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number }) {
  const publicClient = usePublicClient({ chainId });
  return React.useMemo(() => publicClientToProvider(publicClient), [publicClient]);
}

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new ethers.providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number }) {
  const { data: walletClient } = useWalletClient({ chainId});
  return React.useMemo(() => (walletClient ? walletClientToSigner(walletClient) : undefined), [walletClient]);
}
