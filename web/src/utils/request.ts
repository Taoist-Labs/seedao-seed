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
