const peg = require('pegjs');
const fs = require('fs');
const path = require('path');

const grammarPath = path.join(__dirname, 'grammar.pegjs');
const outputPath = path.join(__dirname, '..', 'generated', 'parser.js');

const grammar = fs.readFileSync(grammarPath, 'utf8');

const source = peg.generate(grammar, {
  output: 'source',
  format: 'globals',
  exportVar: 'PEGParser'
});

fs.writeFileSync(outputPath, source);
console.log('Parser generated:', outputPath);
