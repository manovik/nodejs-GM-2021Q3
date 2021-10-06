import { FLAGS } from "./constants";

export const validatePassedParams = (array, indexes) => {
  let isValid = false;

  if (indexes.inFlagIdx <= 0 || indexes.outFlagIdx <= 0) {
    console.error(`Some parameters are not passed. Check ${FLAGS.IN} or ${FLAGS.OUT} params.`);
    return false;
  }

  Object.values(FLAGS).forEach(flag => {
    let counter = 0;

    for (const el of array) {
      el === flag && counter++;
      isValid = counter === 1;
      if (counter > 1) {
        console.error('You passed more than one -in or -out flag. Check it!');
        return false;
      }
    }
  });

  if (Math.max(indexes.inputIdx, indexes.outputIdx) >= array.length) {
    console.error('Seems like one of parameters was not passed after the flag. Check -in or -out flags.');
    return false;
  }

  if (array[indexes.inputIdx] === FLAGS.OUT) {
    console.error(`Pass the filename after '${FLAGS.IN}' flag.`);
    return false;
  }

  if (array[indexes.outputIdx] === FLAGS.IN) {
    console.error(`Pass the filename after '${FLAGS.OUT}' flag.`);
    return false;
  }

  if (!/\.csv$/.test(array[indexes.inputIdx])) {
    console.error('Pass the ".csv" file for converting.');
    return false;
  }

  return isValid;
}
