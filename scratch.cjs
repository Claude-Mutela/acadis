const fs = require('fs');

const data = fs.readFileSync('start/validator.ts', 'utf8');
const match = data.match(/new SimpleMessagesProvider\(\{\s*([\s\S]+?)\s*\}\)/);
if (!match) {
  console.log('No match found');
  process.exit(1);
}

const lines = match[1].split('\n').filter(line => line.includes(':'));
const result = { shared: {}, fields: {} };

for (const line of lines) {
  const parts = line.split(':');
  if (parts.length >= 2) {
    let key = parts[0].trim().replace(/['"]/g, '');
    let val = parts.slice(1).join(':').trim().replace(/^['"]|['"],?$/g, '');
    
    if (key.includes('.')) {
      const field = key.split('.')[0];
      const rule = key.split('.').slice(1).join('.');
      let finalRule = rule;
      if (rule === 'unique') finalRule = 'database.unique';
      
      if (!result.fields[field]) result.fields[field] = {};
      result.fields[field][finalRule] = val;
    } else {
      if (key === 'unique') key = 'database.unique';
      result.shared[key] = val;
    }
  }
}

fs.writeFileSync('resources/lang/fr/validator.json', JSON.stringify(result, null, 2));
console.log('Done!');
