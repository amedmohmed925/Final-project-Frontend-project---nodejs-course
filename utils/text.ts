const truncateChars = (str = "", max = 22) =>
  typeof str === "string" && str.length > max
    ? `${str.slice(0, max).trimEnd()}…`
    : str;

export default truncateChars;