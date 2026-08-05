const fs = require('fs');
const path = require('path');
const dir = 'd:/Glow Cut/frontend  and backend/new frontend/src/pages/profile';

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

walk(dir, function(err, results) {
  if (err) throw err;
  results.filter(f => f.endsWith('.jsx')).forEach(f => {
    let text = fs.readFileSync(f, 'utf8');
    text = text
      .replace(/font-display-lg text-display-lg/g, 'text-4xl font-serif')
      .replace(/font-headline-lg text-headline-lg/g, 'text-3xl font-serif')
      .replace(/font-headline-md text-headline-md/g, 'text-xl font-serif')
      .replace(/font-body-md text-body-md/g, 'text-sm font-sans')
      .replace(/font-label-md text-label-md/g, 'text-sm font-sans font-bold')
      .replace(/font-display-lg/g, 'font-serif')
      .replace(/font-headline-lg/g, 'text-3xl font-serif')
      .replace(/font-headline-md/g, 'text-xl font-serif')
      .replace(/font-body-md/g, 'text-sm font-sans')
      .replace(/font-label-md/g, 'font-bold')
      
      .replace(/shadow-warm-sm/g, 'shadow-[0_0_10px_rgba(228,181,108,0.2)]')
      .replace(/shadow-warm/g, 'shadow-[0_0_20px_rgba(228,181,108,0.2)]')

      .replace(/bg-surface-container-highest/g, 'bg-[#1a1a1a]')
      .replace(/bg-surface-container-high/g, 'bg-[#1a1a1a]')
      .replace(/bg-surface-container-lowest/g, 'bg-[#0a0a0a]')
      .replace(/bg-surface-container-low/g, 'bg-[#0a0a0a]')
      .replace(/bg-surface-container/g, 'bg-[#111111]')
      .replace(/bg-surface-variant/g, 'bg-[#222222]')
      .replace(/bg-surface/g, 'bg-[#111111]')
      .replace(/glass-panel/g, 'bg-[#111111]')

      .replace(/text-on-surface-variant/g, 'text-[#A1A1AA]')
      .replace(/text-on-surface/g, 'text-white')
      .replace(/text-on-primary/g, 'text-black')

      .replace(/text-primary/g, 'text-[#E4B56C]')
      .replace(/bg-primary\/(\d+)/g, 'bg-[#E4B56C]/$1')
      .replace(/bg-primary(?!\/)/g, 'bg-[#E4B56C]')
      .replace(/border-primary\/(\d+)/g, 'border-[#E4B56C]/$1')
      .replace(/border-primary(?!\/)/g, 'border-[#E4B56C]')

      .replace(/bg-error\/(\d+)/g, 'bg-red-500/$1')
      .replace(/bg-error(?!\/)/g, 'bg-red-500')
      .replace(/text-error/g, 'text-red-500')
      .replace(/border-error\/(\d+)/g, 'border-red-500/$1')
      .replace(/border-error(?!\/)/g, 'border-red-500');

    fs.writeFileSync(f, text);
  });
});
