function getMethodName() {
  const temp = new Error().stack
    ?.split('at')[2]
    ?.split(' (')[0]
    .slice(1)
    .split('Module.');

  if (!temp) return '';
  const methodName = temp?.length === 1 ? temp[0] : temp[1];
  return methodName;
}

export default getMethodName;
