const makeShortId = (str: string) =>
  str.length > 6 ? `${ str.slice(0, 3) }...${ str.slice(-6) }` : str;

export default makeShortId;
