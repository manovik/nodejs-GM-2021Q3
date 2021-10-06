const { createReadStream, createWriteStream, mkdirSync } = require('fs');
const path = require('path');
const csv = require('csvtojson');

const FLAGS = {
  IN: '-in',
  OUT: '-out'
}

const findIndexes = (array, indexes) => {
  indexes.inFlagIdx = array.findIndex((el) => el === FLAGS.IN);
  indexes.outFlagIdx = array.findIndex((el) => el === FLAGS.OUT);

  indexes.inputIdx = indexes.inFlagIdx + 1;
  indexes.outputIdx = indexes.outFlagIdx + 1;
}

const validatePassedParams = (array, indexes) => {
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

const cutName = (name) => name.replace(/.+(?<=\/)/, '');

const convertFile = (array) => {
  const IDXs = {
    inFlagIdx: null,
    outFlagIdx: null,
    inputIdx: null,
    outputIdx: null
  }

  findIndexes(array, IDXs);
  const isValid = validatePassedParams(array, IDXs);

  if (isValid) {
    const inputFile = array[IDXs.inputIdx];
    const outputFile = array[IDXs.outputIdx];

    const inputFileFileShortName = cutName(inputFile);
    const outputFileShortName = cutName(outputFile);
    const outputPath = outputFile.replace(outputFileShortName, '');
    createReadStream(path.resolve(inputFile), 'utf-8')
      .on('error', (err) => {
        if (err.code === 'ENOENT') {
          console.error(`Couldn't find ${inputFileFileShortName}. Check the filename or path to one.`);
          process.exit(1);
        }
        console.error(err);
      })
      .pipe(csv())
      .pipe(createWriteStream(outputFile, 'utf-8'))
      .on('finish', () => {
        console.log(
          `File ${inputFileFileShortName} was converted to ${outputFileShortName}.\n\nCheck the "${path.resolve(outputPath)}" folder.`
        );
      })
      .on('error', (err) => {
        if (err.code === 'ENOENT') {
          mkdirSync(outputPath, { recursive: true });
          convertFile(array);
          return;
        }
        console.error(err);
      });
  }
}

convertFile(process.argv);
