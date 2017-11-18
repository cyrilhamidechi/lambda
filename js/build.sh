#!/bin/bash

echo 'Name of the lambda to build for distribution: '
read lambda

[ -d $lambda ] || exit

cd $lambda

[ -d dist ] || mkdir dist
rm -Rf dist/*

cp -r ../commons/*.js ./dist

cp src/*.js dist/
cp src/package.json dist/
[ -d private ] && cp private/*.cfg dist

cd dist/
yarn install
zip -r app.zip ./*
ls -l ./

