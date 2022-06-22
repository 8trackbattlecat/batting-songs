//run this with node
const testFolder = 'songs/';
const {readdirSync, readFile, writeFile} = require('fs');

var songFiles="";
var joinString=""
songFiles=readdirSync(testFolder).join(`',\n'${testFolder}`);
songFiles="'"+testFolder+songFiles+"',\n"

// .forEach(file => {
//   console.log(file);
// });

const versionStamp = Math.round(Date.now() / 1000)  //secondsSinceEpoch

readFile('./service-worker.tmpl.js', 'utf-8', function (err, contents) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(contents.indexOf('songsGoHere'));
  
    const replaced = contents.replace('songsGoHere', songFiles);
    const replaced2=replaced.replace(/\|\|\|VERSIONSTAMP\|\|\|/g, versionStamp);
    writeFile('./service-worker-generated.js', replaced2, 'utf-8', function (err) {
      console.log(err);
    });
  });

  readFile('./index.tmpl.html', 'utf-8', function (err, contents) {
    if (err) {
      console.log(err);
      return;
    }

  

    const replaced=contents.replace(/\|\|\|VERSIONSTAMP\|\|\|/g, versionStamp);
    writeFile('./index.html', replaced, 'utf-8', function (err) {
      console.log(err);
    });
  });

  console.log("expected timestamp=",versionStamp);
