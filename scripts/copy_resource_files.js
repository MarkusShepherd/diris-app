#!/usr/bin/env node

'use strict';

/*jslint node: true, stupid: true */

module.exports = function (ctx) {
    var filestocopy = [
        // {"resources/android/images/logo.png": "platforms/android/res/drawable/logo.png"},
    ],
        fs = ctx.requireCordovaModule('fs'),
        path = ctx.requireCordovaModule('path'),
        rootdir = ctx.opts.projectRoot;

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
};
