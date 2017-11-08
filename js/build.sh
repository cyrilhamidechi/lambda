#!/bin/bash

[ -d dist ] || mkdir dist
rm -Rf dist/*

cp ./*.js ./dist/
cp package.json ./dist/
cp private/*.cfg ./dist

cd dist/
yarn install
zip -r app.zip ./*


