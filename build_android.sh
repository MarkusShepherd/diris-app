#!/usr/bin/env bash

phonegap build android || exit 1
cp platforms/android/build/outputs/apk/android-debug.apk /Users/markus/BTSync/Debug/ || exit 1
cp platforms/android/build/outputs/apk/android-debug.apk /Users/markus/Web/riemannhypothesis.info/static/ || exit 1
s3sync www.riemannhypothesis.info /Users/markus/Web/riemannhypothesis.info/static/
