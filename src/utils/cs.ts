function cs(...values: Array<string | undefined | boolean | null>): string {
  return values.filter(Boolean).join(" ");
}

export default cs;
