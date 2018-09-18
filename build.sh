#!/bin/bash

DIR="$(pwd)"
OUTPUT_DIRNAME="build"
OUTPUT_FILENAME="shk4-latest.zip"

[ -d "$DIR"/"$OUTPUT_DIRNAME" ] || mkdir "$DIR"/"$OUTPUT_DIRNAME"

rm -rfv "$DIR"/"$OUTPUT_DIRNAME"/*

cp "$DIR"/composer.json "$DIR"/"$OUTPUT_DIRNAME"
cp "$DIR"/LICENSE "$DIR"/"$OUTPUT_DIRNAME"
cp -r "$DIR"/app "$DIR"/"$OUTPUT_DIRNAME"
cp -r "$DIR"/bin "$DIR"/"$OUTPUT_DIRNAME"
cp -r "$DIR"/src "$DIR"/"$OUTPUT_DIRNAME"
cp -r "$DIR"/tests "$DIR"/"$OUTPUT_DIRNAME"
cp -r "$DIR"/vendor "$DIR"/"$OUTPUT_DIRNAME"

rm "$DIR"/"$OUTPUT_DIRNAME"/app/config/settings.yml
touch "$DIR"/"$OUTPUT_DIRNAME"/app/config/settings.yml

mkdir "$DIR"/"$OUTPUT_DIRNAME"/var
mkdir "$DIR"/"$OUTPUT_DIRNAME"/var/cache
mkdir "$DIR"/"$OUTPUT_DIRNAME"/var/logs
mkdir "$DIR"/"$OUTPUT_DIRNAME"/var/sessions
cp "$DIR"/var/bootstrap.php.cache "$DIR"/"$OUTPUT_DIRNAME"/var
cp "$DIR"/var/SymfonyRequirements.php "$DIR"/"$OUTPUT_DIRNAME"/var

mkdir "$DIR"/"$OUTPUT_DIRNAME"/web
cp "$DIR"/web/*.* "$DIR"/"$OUTPUT_DIRNAME"/web
rm "$DIR"/"$OUTPUT_DIRNAME"/web/package-lock.json
cp -r "$DIR"/web/bundles "$DIR"/"$OUTPUT_DIRNAME"/web
cp -r "$DIR"/web/css "$DIR"/"$OUTPUT_DIRNAME"/web
cp -r "$DIR"/web/img "$DIR"/"$OUTPUT_DIRNAME"/web
cp -r "$DIR"/web/js "$DIR"/"$OUTPUT_DIRNAME"/web
mkdir "$DIR"/"$OUTPUT_DIRNAME"/web/uploads

mkdir "$DIR"/"$OUTPUT_DIRNAME"/web/node_modules
cp -r "$DIR"/web/node_modules/bootstrap "$DIR"/"$OUTPUT_DIRNAME"/web/node_modules
cp -r "$DIR"/web/node_modules/jquery "$DIR"/"$OUTPUT_DIRNAME"/web/node_modules
cp -r "$DIR"/web/node_modules/nouislider "$DIR"/"$OUTPUT_DIRNAME"/web/node_modules
cp -r "$DIR"/web/node_modules/popper.js "$DIR"/"$OUTPUT_DIRNAME"/web/node_modules
cp -r "$DIR"/web/node_modules/wnumb "$DIR"/"$OUTPUT_DIRNAME"/web/node_modules

mkdir "$DIR"/"$OUTPUT_DIRNAME"/web/shk-app
cp "$DIR"/web/shk-app/*.* "$DIR"/"$OUTPUT_DIRNAME"/web/shk-app
cp -r "$DIR"/web/shk-app/bundle "$DIR"/"$OUTPUT_DIRNAME"/web/shk-app
cp -r "$DIR"/web/shk-app/css "$DIR"/"$OUTPUT_DIRNAME"/web/shk-app
cp -r "$DIR"/web/shk-app/e2e "$DIR"/"$OUTPUT_DIRNAME"/web/shk-app
cp -r "$DIR"/web/shk-app/i18n "$DIR"/"$OUTPUT_DIRNAME"/web/shk-app
cp -r "$DIR"/web/shk-app/img "$DIR"/"$OUTPUT_DIRNAME"/web/shk-app
cp -r "$DIR"/web/shk-app/locale "$DIR"/"$OUTPUT_DIRNAME"/web/shk-app
cp -r "$DIR"/web/shk-app/src "$DIR"/"$OUTPUT_DIRNAME"/web/shk-app

mkdir "$DIR"/"$OUTPUT_DIRNAME"/web/shk-app/node_modules
cp -r "$DIR"/web/shk-app/node_modules/bootstrap "$DIR"/"$OUTPUT_DIRNAME"/web/shk-app/node_modules
cp -r "$DIR"/web/shk-app/node_modules/primeng "$DIR"/"$OUTPUT_DIRNAME"/web/shk-app/node_modules

cd "$DIR"/"$OUTPUT_DIRNAME"; zip -r -9 ../"$OUTPUT_FILENAME" *
rm -rfv "$DIR"/"$OUTPUT_DIRNAME"/*
