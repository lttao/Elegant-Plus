interface createNamespace {
  prefixedName: string
}

export function createNamespace(name: string): createNamespace {
  const prefixedName = `Eg${name.charAt(0).toUpperCase() + name.slice(1)}`;
  return {
    prefixedName,
  };
}
