function truncateString(str: string | null | undefined, length: number) {
  if (typeof str !== "string") return "";

  if (str.length > length) return `${str.substring(0, length)}...`;

  return str;
}

export default truncateString;
