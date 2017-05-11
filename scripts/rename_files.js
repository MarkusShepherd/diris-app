#!/usr/bin/env node

'use strict';

/*jslint node: true, stupid: true */

module.exports = function (ctx) {
    var filesToRename = [
        {'platforms/android/build/outputs/apk/android-debug.apk': 'platforms/android/build/outputs/apk/diris.apk'},
    ],
        fs = ctx.requireCordovaModule('fs'),
        path = ctx.requireCordovaModule('path'),
        rootdir = ctx.opts.projectRoot;

    filesToRename.forEach(function (obj) {
        Object.keys(obj).forEach(function (key) {
            var val = obj[key],
                srcfile = path.join(rootdir, key),
                destfile = path.join(rootdir, val);

            if (fs.existsSync(srcfile)) {
                fs.renameSync(srcfile, destfile);
            }
        });
    });
};
