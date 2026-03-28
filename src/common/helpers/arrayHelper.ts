export const areArraysEqual = (arr1: any[], arr2: any[]) => {
  const a1 = arr1 || [];
  const a2 = arr2 || [];

  if (a1.length !== a2.length) return false;
  const sorted1 = [...a1].map(String).sort();
  const sorted2 = [...a2].map(String).sort();

  return sorted1.every((value, index) => value === sorted2[index]);
};
