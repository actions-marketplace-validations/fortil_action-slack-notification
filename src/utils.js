module.exports.isMissingKey = (object) => {
  console.log('===>Envs', process.env);
  console.log('===>object', object);

  return Object.keys(object).map(k => !object[k]).filter(f => !!f).some(f => f === true);
}