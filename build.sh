#!/bin/bash

DIR="$(pwd)"
OUTPUT_DIRNAME="build"
OUTPUT_FILENAME="shk4-latest.zip"

[ -d "$DIR"/"$OUTPUT_DIRNAME" ] || mkdir "$DIR"/"$OUTPUT_DIRNAME"

if [ -e "$DIR"/"$OUTPUT_FILENAME" ]
then
    rm "$DIR"/"$OUTPUT_FILENAME"
fi

rm -rfv "$DIR"/"$OUTPUT_DIRNAME"/*

cp "$DIR"/composer.json "$DIR"/"$OUTPUT_DIRNAME"
cp "$DIR"/LICENSE "$DIR"/"$OUTPUT_DIRNAME"
cp "$DIR"/.env "$DIR"/"$OUTPUT_DIRNAME"
cp -r "$DIR"/bin "$DIR"/"$OUTPUT_DIRNAME"
cp -r "$DIR"/config "$DIR"/"$OUTPUT_DIRNAME"
cp -r "$DIR"/src "$DIR"/"$OUTPUT_DIRNAME"
cp -r "$DIR"/templates "$DIR"/"$OUTPUT_DIRNAME"
cp -r "$DIR"/tests "$DIR"/"$OUTPUT_DIRNAME"
cp -r "$DIR"/translations "$DIR"/"$OUTPUT_DIRNAME"
cp -r "$DIR"/vendor "$DIR"/"$OUTPUT_DIRNAME"

rm "$DIR"/"$OUTPUT_DIRNAME"/config/settings.yaml
touch "$DIR"/"$OUTPUT_DIRNAME"/config/settings.yaml

mkdir "$DIR"/"$OUTPUT_DIRNAME"/var
mkdir "$DIR"/"$OUTPUT_DIRNAME"/var/cache
mkdir "$DIR"/"$OUTPUT_DIRNAME"/var/log

mkdir "$DIR"/"$OUTPUT_DIRNAME"/public
cp "$DIR"/public/*.* "$DIR"/"$OUTPUT_DIRNAME"/public
rm "$DIR"/"$OUTPUT_DIRNAME"/public/package-lock.json
cp -r "$DIR"/public/app_build "$DIR"/"$OUTPUT_DIRNAME"/public
cp -r "$DIR"/public/css "$DIR"/"$OUTPUT_DIRNAME"/public
cp -r "$DIR"/public/img "$DIR"/"$OUTPUT_DIRNAME"/public
cp -r "$DIR"/public/js "$DIR"/"$OUTPUT_DIRNAME"/public
mkdir "$DIR"/"$OUTPUT_DIRNAME"/public/uploads

cp -r "$DIR"/public/admin "$DIR"/"$OUTPUT_DIRNAME"/public/admin
rm -rf "$DIR"/"$OUTPUT_DIRNAME"/public/admin/bundle-dev

mkdir "$DIR"/"$OUTPUT_DIRNAME"/public/node_modules
cp -r "$DIR"/public/node_modules/bootstrap "$DIR"/"$OUTPUT_DIRNAME"/public/node_modules
cp -r "$DIR"/public/node_modules/jquery "$DIR"/"$OUTPUT_DIRNAME"/public/node_modules
cp -r "$DIR"/public/node_modules/nouislider "$DIR"/"$OUTPUT_DIRNAME"/public/node_modules
cp -r "$DIR"/public/node_modules/popper.js "$DIR"/"$OUTPUT_DIRNAME"/public/node_modules
cp -r "$DIR"/public/node_modules/wnumb "$DIR"/"$OUTPUT_DIRNAME"/public/node_modules

mkdir "$DIR"/"$OUTPUT_DIRNAME"/frontend
cp "$DIR"/frontend/*.* "$DIR"/"$OUTPUT_DIRNAME"/frontend
cp -r "$DIR"/frontend/css "$DIR"/"$OUTPUT_DIRNAME"/frontend
cp -r "$DIR"/frontend/e2e "$DIR"/"$OUTPUT_DIRNAME"/frontend
cp -r "$DIR"/frontend/img "$DIR"/"$OUTPUT_DIRNAME"/frontend
cp -r "$DIR"/frontend/locale "$DIR"/"$OUTPUT_DIRNAME"/frontend
cp -r "$DIR"/frontend/src "$DIR"/"$OUTPUT_DIRNAME"/frontend

cd "$DIR"/"$OUTPUT_DIRNAME"; zip -r -9 ../"$OUTPUT_FILENAME" .
rm -rfv "$DIR"/"$OUTPUT_DIRNAME"/*
