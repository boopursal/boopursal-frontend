const fs = require('fs');
const path = require('path');

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      filelist = walk(p, filelist);
    } else if (p.endsWith('.js')) {
      filelist.push(p);
    }
  }
  return filelist;
}

const files = walk('c:/Users/Admin/Documents/GitHub/2026/Boopursal/boofrontend/src/app');
let changed = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  
  // Find <Button ... color="primary" ...> ... Non ... </Button> and similar
  // It's safer to just replace `<Button([^>]*?)color="primary"([^>]*?)>([\s\n]*)Non([\s\n]*)<\/Button>`
  // to `<Button$1color="default" variant="contained"$2>$3Non$4</Button>`
  newContent = newContent.replace(/<Button([^>]*?)color="primary"([^>]*?)>([\s\r\n]*)Non([\s\r\n]*)<\/Button>/g, '<Button$1color="default" variant="contained"$2>$3Non$4</Button>');
  
  newContent = newContent.replace(/<Button([^>]*?)color="primary"([^>]*?)>([\s\r\n]*)Oui([\s\r\n]*)<\/Button>/g, '<Button$1color="secondary" variant="contained"$2>$3Oui$4</Button>');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changed++;
    console.log('Updated', file);
  }
}
console.log('Total changed:', changed);
