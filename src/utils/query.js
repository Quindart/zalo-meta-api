export const responseEntity = (queryField) => {
  if (!queryField || queryField.length === 0) {
    return {};
  }
  let obj = {};
  queryField.split(",").forEach((item) => {
    obj[item] = 1;
  });
  return obj;
};
