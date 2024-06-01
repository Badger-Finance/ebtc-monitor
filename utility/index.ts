export const isObject = (obj: any) =>
  typeof obj === "object" && !Array.isArray(obj) && obj !== null;

export const isBigNumber = (obj: any) => obj?.['type'] === 'BigNumber'