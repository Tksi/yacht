// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const replacer = (_: string, value: any) => {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: [...value.entries()],
    };
  } else {
    return value;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const reviver = (_: string, value: any) => {
  if (typeof value === 'object' && value !== null && value.dataType === 'Map') {
    return new Map(value.value);
  }

  return value;
};
