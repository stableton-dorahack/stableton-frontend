export const toFixed = (value: number, precision: number = 0) => {
  const power = Math.pow(10, precision);
  return Math.floor(value * power) / power;
};

export const fromNano = (value: bigint) => toFixed(Number(value) / 1e9, 2);

export const formatAddress = (address: string) =>
  `${address.slice(0, 4)}...${address.slice(-4)}`;

export const toNumber = (value: bigint | undefined) => {
  return value ? fromNano(value) : 0;
};
