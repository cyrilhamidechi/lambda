#!/bin/bash

[ -d dist ] || mkdir dist
rm -Rf dist/*

cp ./src/*.js ./dist/
cp ./src/package.json ./dist/
cp ./private/*.cfg ./dist

cd dist/
yarn install
zip -r app.zip ./*


