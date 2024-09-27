function getMethodName() {
  const error = new Error().stack
    ?.split('at')[2]
    .split(' Module.')[1]
    .split(' ');
  if (error) return error[0];

  return '';
}

export default getMethodName;
