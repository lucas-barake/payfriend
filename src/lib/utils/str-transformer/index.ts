export const strTransformer = {
  normalize: (str: string) =>
    str
      .toLowerCase()
      // Normalize to canonical decomposition
      .normalize("NFD")
      // Remove diacritics
      .replace(/[\u0300-\u036f]/g, ""),
  truncate: (str: string | null | undefined, length: number) => {
    if (typeof str !== "string") return "";
    if (str.length > length) return `${str.substring(0, length)}...`;
    return str;
  },
  removeWhitespace: (str: string) => str.replace(/\s/g, ""),
};
