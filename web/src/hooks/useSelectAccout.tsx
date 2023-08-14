import { useWeb3React } from "@web3-react/core";
import { useAppContext } from "providers/appProvider";
import { uniPassHooks } from "wallet/connector";
import { WalletType } from "wallet/wallet";

const { useProvider, useAccount } = uniPassHooks;

export default function useSelectAccount() {
  const {
    state: { wallet_type },
  } = useAppContext();

  const { account, provider } = useWeb3React();

  const _uprovider = useProvider();
  const _account = useAccount();

  console.log("=================");
  console.log("wallet_type: ", wallet_type);

  console.log(
    "provider: ",
    provider?.connection?.url,
    _uprovider?.connection?.url,
  );
  console.log("account: ", account, _account);
  switch (wallet_type) {
    case WalletType.EOA:
      return { account, provider };
    case WalletType.AA:
      return { account: _account, provider: _uprovider };
    default:
      return { account: undefined, provider: undefined };
  }
}
