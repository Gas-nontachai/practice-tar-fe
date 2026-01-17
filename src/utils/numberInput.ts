export const isPositiveInteger = (value: string): boolean => {
  if (value === "") return true;
  return /^[1-9][0-9]*$/.test(value);
};

export const preventInvalidNumberKey = (
  e: React.KeyboardEvent<HTMLInputElement>,
) => {
  if (["e", "E", "+", "-", "."].includes(e.key)) {
    e.preventDefault();
  }
};
