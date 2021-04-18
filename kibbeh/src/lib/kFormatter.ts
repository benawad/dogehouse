export const kFormatter = (num: number) => {
  if (Math.abs(num) > 999999999) {
    return `${
      Math.sign(num) * Number((Math.abs(num) / 1000000000).toFixed(1))
    }b`;
  }
  if (Math.abs(num) > 999999) {
    return `${Math.sign(num) * Number((Math.abs(num) / 1000000).toFixed(1))}m`;
  }
  if (Math.abs(num) > 999) {
    return `${Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(1))}k`;
  }

  return Math.sign(num) * Math.abs(num);
};
