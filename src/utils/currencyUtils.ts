export function formatToAud(value: number): string {
  return roundUp(value, 2).toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
  });
}

export function roundUp(value: number, precision: number): number {
  const multiplier = Math.pow(10, precision || 0);
  return Math.ceil(value * multiplier) / multiplier;
}
