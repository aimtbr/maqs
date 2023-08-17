export const getLocalTimezoneOffset = (): number => {
  const REVERSE_SIGN = -1;
  
  return new Date().getTimezoneOffset() * REVERSE_SIGN;
};
