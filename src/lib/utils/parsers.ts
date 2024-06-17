export function camelToSnake(str) {
  return str.replace(/([A-Z])/g, function ($1) {
    return '_' + $1.toLowerCase();
  });
}

export function convertKeysToSnakeCase(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToSnakeCase(item));
  } else if (obj !== null && obj.constructor === Object) {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
      const newKey = camelToSnake(key);
      newObj[newKey] = convertKeysToSnakeCase(obj[key]);
    });
    return newObj;
  }
  return obj;
}
