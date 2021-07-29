module.exports.isMissingKey = (object) => {
  return Object.keys(object).map(k => !object[k]).filter(f => !!f).some(f => f === true);
}