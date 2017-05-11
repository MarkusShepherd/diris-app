#!/usr/bin/env node

'use strict';

/*jslint node: true, stupid: true */

module.exports = function (ctx) {
    var filestocopy = [
        {'www/manifest.json': 'platforms/browser/www/manifest.json'},
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
