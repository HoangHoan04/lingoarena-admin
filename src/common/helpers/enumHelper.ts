export const getEnumOptions = (
  enumObject: any,
  translationPath: string,
  t: any,
) => {
  return Object.values(enumObject).map((item: any) => ({
    id: item.code,
    value: item.code,
    name: t(`${translationPath}.${item.code}`, item.name),
  }));
};

export const getEnumName = (
  enumObject: any,
  code: string,
  translationPath: string,
  t: any,
) => {
  const item = Object.values(enumObject).find(
    (i: any) => i.code === code,
  ) as any;
  return t(`${translationPath}.${code}`, item?.name || "N/A");
};
