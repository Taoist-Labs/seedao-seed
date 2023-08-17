import { useWeb3React } from "@web3-react/core";
import { useAppContext } from "providers/appProvider";
import { uniPassHooks } from "wallet/connector";
import { WalletType } from "wallet/wallet";
import { injected, uniPassWallet } from "wallet/connector";

const { useProvider, useAccount, useChainId } = uniPassHooks;

export default function useSelectAccount() {
  const {
    state: { wallet_type },
  } = useAppContext();

  const { account, provider, chainId } = useWeb3React();

  const _uprovider = useProvider();
  const _account = useAccount();
  const _chainId = useChainId();

  // console.log("=================");
  // console.log("wallet_type: ", wallet_type);

  // console.log(
  //   "provider: ",
  //   provider?.connection?.url,
  //   _uprovider?.connection?.url,
  // );
  // console.log("account: ", account, _account);
  // console.log("chainId: ", chainId, _chainId);
  switch (wallet_type) {
    case WalletType.EOA:
      return { account, provider, chainId, connector: injected };
    case WalletType.AA:
      return {
        account: _account,
        provider: _uprovider,
        chainId: _chainId,
        connector: uniPassWallet,
      };
    default:
      return {
        account: undefined,
        provider: undefined,
        chainId: undefined,
        connector: undefined,
      };
  }
}
