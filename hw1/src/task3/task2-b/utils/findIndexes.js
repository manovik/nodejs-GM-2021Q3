import { FLAGS } from "./constants";

export const findIndexes = (array, indexes) => {
  indexes.inFlagIdx = array.findIndex((el) => el === FLAGS.IN);
  indexes.outFlagIdx = array.findIndex((el) => el === FLAGS.OUT);

  indexes.inputIdx = indexes.inFlagIdx + 1;
  indexes.outputIdx = indexes.outFlagIdx + 1;
}
