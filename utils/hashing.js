const { hash, compare } = require("bcrypt");

exports.doHash = async (value, saltValue) => {
  const hashedValue = await hash(value, saltValue);
  return hashedValue;
};

exports.doHashValidation = async (value, hashedValue) => {
  const result = await compare(value, hashedValue);
  return result;
};
