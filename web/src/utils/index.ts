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
