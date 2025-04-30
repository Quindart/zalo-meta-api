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
