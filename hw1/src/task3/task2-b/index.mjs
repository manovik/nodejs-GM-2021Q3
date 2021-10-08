import { readFile, writeFile } from 'fs';
import { promisify } from 'util';
import csvtojson from 'csvtojson'

const input = process.argv[2];
const output = process.argv[3];
const read = promisify(readFile);

const f = (element) => {
  writeFile(output, `${JSON.stringify(element)}\n`, { flag: 'a+'}, (err) => {
    if(err)
      console.error(err);
  });
}

await read(input, 'utf-8')
  .then(data => csvtojson().fromString(data).subscribe(f))
  .catch(console.error);
