import { SEED_CONTRACTS } from "./contract";
import { USE_NETWORK } from "utils/constant";

const JWT =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlYTg4MTdhMC1iOWI3LTRkZjAtYmNlNi1iMzhhMGI4NDhjNTQiLCJlbWFpbCI6Im1tbXBvbGFyODg4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI3NThjNzA1YmM5Y2JkZjA5MmQ1NCIsInNjb3BlZEtleVNlY3JldCI6IjU3MTQ1YWM5Mzc4NmNkNmMzMmUwYjY2NzRkZjQzMjlhMmI1MDdjZjg5NTFmZWM2MTk3ZGE2ZWU5N2ViMjYwZjkiLCJpYXQiOjE2ODA4ODcwNjJ9.oK-aHC60joh1yYQoNYyt4Gjm0TIddEBch-0sCiz-SXk";

export const uploadByFetch = (fileData: any, headers = {}) => {
  const formData = new FormData();
  formData.append("file", fileData);

  const options = JSON.stringify({
    cidVersion: 0,
  });
  formData.append("pinataOptions", options);

  return fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: JWT,
      ...headers,
    },
  });
};

export const uploadImage = async (fileData: any) => {
  return fetch("https://image-share.fn-labs.workers.dev ", {
    method: "POST",
    body: fileData,
  });
};

const NFTSCAN_REQUEST_HEADER = {
  "X-API-KEY": process.env.REACT_APP_NFTSCAN_KEY,
};

const handleRequest = (url: string) => {
  return fetch(url, {
    method: "GET",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    headers: NFTSCAN_REQUEST_HEADER,
  });
};

const get_base_endpoint = () => {
  let base = "";
  if (USE_NETWORK === "POLYGON") {
    base = "polygonapi.nftscan.com";
  } else if (USE_NETWORK === "ETHEREUM") {
    base = "restapi.nftscan.com";
  }
  return base;
};

export const getNftCollection = () => {
  const base = get_base_endpoint();
  if (!base) {
    throw new Error("[nftscan] not support");
  }
  return handleRequest(
    `https://${base}/api/v2/statistics/collection/${SEED_CONTRACTS[USE_NETWORK]}`,
  );
};

export const getNftByAccount = (account: string) => {
  const base = get_base_endpoint();
  if (!base) {
    throw new Error("[nftscan] not support");
  }
  return fetch(
    `https://${base}/api/v2/account/own/${account}?erc_type=erc721&show_attribute=true&sort_field=&sort_direction=&contract_address=${SEED_CONTRACTS.POLYGON}`,
    {
      method: "GET",
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      headers: NFTSCAN_REQUEST_HEADER,
    },
  );
};
