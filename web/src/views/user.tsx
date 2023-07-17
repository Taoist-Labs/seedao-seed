import styled from "@emotion/styled";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { ethers, Contract } from "ethers";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useAppContext, AppActionType } from "providers/appProvider";
import Chain from "utils/chain";

const SCR_CONTRACT = "0x77dea9602D6768889819B24D6f5deB7e3362B496";
const SEED_CONTRACT_BSC_TESTNET = "0x22B3a87635B7fF5E8e1178522596a6e23b568DDE";

export default function UserPage() {
  const { account, provider, chainId, connector } = useWeb3React();
  const { dispatch } = useAppContext();

  const [points, setPoints] = useState("0");
  const [hasSeed, setHasSeed] = useState(false);
  const [seedContract, setSeedContract] = useState<Contract>();

  const getSeedContract = () => {
    if (!provider) {
      return;
    }
    const signer = provider.getSigner(account);
    const contract = new ethers.Contract(
      SEED_CONTRACT_BSC_TESTNET,
      [
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "claimWithPoints",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      signer,
    );
    setSeedContract(contract);
  };

  const getSeedBalance = async () => {
    if (!seedContract) {
      return;
    }
    const data = await seedContract.balanceOf(account);
    setHasSeed(data.eq(ethers.BigNumber.from(1)));
  };

  const getSCR = async () => {
    const provider = new ethers.providers.StaticJsonRpcProvider(
      "https://endpoints.omniatech.io/v1/bsc/testnet/public",
    );
    try {
      const contract = new ethers.Contract(
        SCR_CONTRACT,
        [
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "balanceOf",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        provider,
      );
      const data = await contract.balanceOf(account);
      setPoints(ethers.utils.formatUnits(data, 6));
    } catch (error) {
      console.error("getSCR error", error);
    }
  };

  useEffect(() => {
    getSeedBalance();
  }, [seedContract]);

  useEffect(() => {
    account && getSCR();
    chainId === 97 && account && getSeedContract();
  }, [chainId, account]);

  const goMint = async () => {
    if (!seedContract) {
      return;
    }
    // check network
    if (chainId !== 97) {
      await connector.activate({ ...Chain.BSC_TESTNET });
    }
    dispatch({ type: AppActionType.SET_LOADING, payload: true });

    try {
      const res = await seedContract.claimWithPoints();
      await res.wait();
      console.log("mint done");
      setHasSeed(true);
    } catch (error) {
      console.error("goMint error", error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  return (
    <UserPageStyle>
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            积分：{points}
          </Typography>
          {hasSeed ? (
            <Button onClick={goMint} disabled={true} variant="contained">
              You have minted Seed
            </Button>
          ) : (
            <Button
              onClick={goMint}
              disabled={Number(points) < 50000}
              variant="contained"
            >
              Mint Seed
            </Button>
          )}
        </CardContent>
      </Card>
    </UserPageStyle>
  );
}

const UserPageStyle = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  width: 300px;
  height: 150px;
  gap: 16px;
`;
