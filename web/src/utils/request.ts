import { SEED_CONTRACTS } from "./contract";
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
  const formData = new FormData();
  formData.append("file", fileData);
  formData.append("permission", "1");

  return fetch("https://pnglog.com/api/v1/upload", {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
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

export const getNftCollection = () => {
  return handleRequest(
    `https://restapi.nftscan.com/api/v2/statistics/collection/${SEED_CONTRACTS.SEPOLIA}`,
  );
};

export const getNftByAccount = (account: string) => {
  return fetch(
    `https://restapi.nftscan.com/api/v2/account/own/${account}?erc_type=erc721&show_attribute=true&sort_field=&sort_direction=&contract_address=${SEED_CONTRACTS.SEPOLIA}`,
    {
      method: "GET",
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      headers: NFTSCAN_REQUEST_HEADER,
    },
  );
};
