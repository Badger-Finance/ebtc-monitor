function isHexNumber(input: string) {
  const hexRegex = /^[0-9A-Fa-f]+$/;
  return hexRegex.test(input);
}

export function convertBigNumberToNormal(bigNumber: {
  type: "BigNumber";
  hex: string;
}): number {
  // Remove the "0x" prefix from the hexadecimal value
  const hex = bigNumber.hex.replace(/^0x/, "");

  // Convert the hexadecimal value to decimal
  const decimal = BigInt(`0x${hex}`).toString();

  // Get the number of trailing zeros in the original BigNumber
  const trailingZeros = hex.length - hex.trimEnd("0").length;

  // Divide the decimal value by 10 raised to the power of trailing zeros
  const result = parseFloat(decimal) / Math.pow(10, trailingZeros);

  return result;
}

export function convertToScientificNotation(number: number) {
  const scientificNotation = number / 1e18;
  return scientificNotation;
}
