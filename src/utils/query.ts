export const responseEntity = (queryField: any) => {
  if (!queryField || queryField.length === 0) {
    return {};
  }
  let obj = {};
  queryField.split(",").forEach((item: string) => {
    obj[item] = 1;
  });
  return obj;
};


export const removeUndefined = (obj: Record<string, any>): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  );
};