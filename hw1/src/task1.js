const readline = require('readline');

const revertLine = () => {

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  const revert = (text = 'Enter the line to revert\n') => {
    rl.question(text, (line) => {
      process.stdout.write(line.split('').reverse().join('') + '\n\n');
      revert('');
    });
  }

  revert();
}

revertLine();
