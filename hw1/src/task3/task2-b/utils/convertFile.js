import { createReadStream, createWriteStream, mkdirSync } from 'fs';
import path from 'path';
import * as csv from 'csvtojson';
import { findIndexes } from './utils/findIndexes'; 
import { validatePassedParams } from './utils/validate';
import { cutName } from './utils/cutName';

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