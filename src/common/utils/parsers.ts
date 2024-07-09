export function parseToSnakeCase(str) {
  return str.replace(/([A-Z])/g, function ($1) {
    return '_' + $1.toLowerCase();
  });
}

export function parseToCamelCase(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => parseToCamelCase(item));
  }

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase(),
    );
    let value = obj[key];

    if (value !== null && typeof value === 'object') {
      value = parseToCamelCase(value); // Recursively apply transformation
    }

    acc[camelKey] = value;
    return acc;
  }, {});
}

export function convertKeysToSnakeCase(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToSnakeCase(item));
  } else if (obj !== null && obj.constructor === Object) {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
      const newKey = parseToSnakeCase(key);
      newObj[newKey] = convertKeysToSnakeCase(obj[key]);
    });
    return newObj;
  }
  return obj;
}
