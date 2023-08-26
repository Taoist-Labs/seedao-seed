export const addressToShow = (address: string, num?: number) => {
  if (!address) return "...";
  const n = num || 4;

  const frontStr = address.substring(0, n);

  const afterStr = address.substring(address.length - n, address.length);

  return `${frontStr}...${afterStr}`;
};

export const formatNumber = (num: number) => {
  return num.toLocaleString("en-US");
};

export const getShortDisplay = (v: string, num: number) => {
  if (!v) return v;
  const arr = v.split(".");
  let res = arr[0];
  if (arr[1]) {
    res += `.${arr[1].slice(0, num || 6)}`;
  }
  return res;
};
