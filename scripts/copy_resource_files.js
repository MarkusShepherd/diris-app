#!/usr/bin/env node

// each object in the array consists of a key which refers to the source and
// the value which is the destination.
var filestocopy = [
    {'www/manifest.json': 'platforms/browser/www/manifest.json'},
    // {"resources/android/images/logo.png": "platforms/android/res/drawable/logo.png"},
    // {"resources/android/sounds/ring.mp3": "platforms/android/res/raw/ring.mp3"},
    // {"resources/ios/sounds/ring.caf": "platforms/ios/YourAppName/ring.caf"}
];

var fs = require('fs'),
    path = require('path'),
    // no need to configure below
    rootdir = process.argv[2];

// Create res/raw directory so that copy does not fail.
fs.mkdir('platforms/android/res/raw/', 0777, function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log("the directory create success");
    }
});

filestocopy.forEach(function (obj) {
    Object.keys(obj).forEach(function (key) {
        var val = obj[key],
            srcfile = path.join(rootdir, key),
            destfile = path.join(rootdir, val),
            destdir = path.dirname(destfile);

        if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
            fs.createReadStream(srcfile).pipe(fs.createWriteStream(destfile));
        }
    });
});
