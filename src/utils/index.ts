export const dateFormatter = (d: number): string => {
  return new Date(d).toLocaleDateString();
};
