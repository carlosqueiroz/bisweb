#!/usr/bin/env node

/*  LICENSE
    
    _This file is Copyright 2018 by the Image Processing and Analysis Group (BioImage Suite Team). Dept. of Radiology & Biomedical Imaging, Yale School of Medicine._
    
    BioImage Suite Web is licensed under the Apache License, Version 2.0 (the "License");
    
    - you may not use this software except in compliance with the License.
    - You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)
    
    __Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.__
    
    ENDLICENSE */



'use strict';

global.bioimagesuiteweblib=true;

require('../config/bis_checknodeversion');
const fs=require('fs');
const path=require('path');
const program=require('commander');
const appinfo=require('../package.json');
require('../config/bisweb_pathconfig.js');

var help = function() {
    console.log('\nThis program fixes the manifest file.\n');
};

program.version('1.0.0')
    .option('-o, --output <s>', 'The output directory for the package.json file')
    .on('--help',function() {
        help();
    })
    .parse(process.argv);



let output = program.output || null;

if (output === null) {
    console.log('--- must specify an output file using -o flag');
    process.exit(0);
}



let devDependencies= appinfo.dependencies;
devDependencies["mocha"]="3.5.3";

let obj = { 
    "name": "biswebnode",
    "version": appinfo.version,
    "description": "A node.js implementation of BioImage Suite Web command line tools in Javascript and WebAssembly",
    "homepage": appinfo.homepage,
    "main" : "lib/bioimagesuiteweblib.js",
    "author": appinfo.author,
    "license": "GPL v2 or Apache",
    "bin" : "lib/bisweb.js",
    "dependencies": {
        "colors": "1.1.2",
        "http-proxy": "1.17.0",
        "request": "2.88.0",
        "websocket-stream": "5.1.2",
        "ws": "6.1.2"
    },

    "repository": {
        "type" : "git",
        "url" : "https://github.com/bioimagesuiteweb/bisweb"
    },
    "devDependencies" : devDependencies,
    "scripts" : {
        "test": "mocha test/test_module.js"
    }
};



let txt=JSON.stringify(obj,null,4)+"\n";

console.log('++++ Output = \n'+txt+'++++');


output=path.resolve(path.join(output,"package.json"));

fs.writeFileSync(output,txt);
console.log('++++');
console.log('++++ Package.json file updated in',output);
console.log('++++ Once you "make install", run "npm pack" to create the package');
console.log('++++');
process.exit(0);
