const parseDbData = (data: any, key: string) => {
  const array = data.rows[0][key];
  if (array) return array[0];
  return null;
};

export default parseDbData;
