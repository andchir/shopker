#!/bin/bash

DIR="$(pwd)"
OUTPUT_DIRNAME="build"
OUTPUT_FILENAME="shopker"
OUTPUT_FILENAME_SUFFIX="latest"
OUTPUT_FILENAME_EXT="zip";

if [ -n "$1" ]; then
    OUTPUT_FILENAME_SUFFIX="$1"
fi

OUTPUT_FILENAME_FULL="${OUTPUT_FILENAME}-${OUTPUT_FILENAME_SUFFIX}.${OUTPUT_FILENAME_EXT}";

[ -d "${DIR:?}"/"${OUTPUT_DIRNAME:?}" ] || mkdir "${DIR:?}"/"${OUTPUT_DIRNAME:?}"

if [ -e "${DIR:?}"/"${OUTPUT_FILENAME_FULL:?}" ]
then
    rm "${DIR:?}"/"${OUTPUT_FILENAME_FULL:?}"
fi

rm -rfv "${DIR:?}"/"${OUTPUT_DIRNAME:?}"/*

cp "$DIR"/composer.json "$DIR"/"$OUTPUT_DIRNAME"
cp "$DIR"/changelog.txt "$DIR"/"$OUTPUT_DIRNAME"
cp "$DIR"/.env.dist "$DIR"/"$OUTPUT_DIRNAME"/.env
cp -r "$DIR"/bin "$DIR"/"$OUTPUT_DIRNAME"
cp -r "$DIR"/config "$DIR"/"$OUTPUT_DIRNAME"
cp -r "$DIR"/src "$DIR"/"$OUTPUT_DIRNAME"
#cp -r "$DIR"/tests "$DIR"/"$OUTPUT_DIRNAME"
cp -r "$DIR"/translations "$DIR"/"$OUTPUT_DIRNAME"
cp -r "$DIR"/vendor "$DIR"/"$OUTPUT_DIRNAME"

rm "$DIR"/"$OUTPUT_DIRNAME"/config/settings.yaml
touch "$DIR"/"$OUTPUT_DIRNAME"/config/settings.yaml

mkdir "$DIR"/"$OUTPUT_DIRNAME"/var
mkdir "$DIR"/"$OUTPUT_DIRNAME"/var/cache
mkdir "$DIR"/"$OUTPUT_DIRNAME"/var/log

mkdir "$DIR"/"$OUTPUT_DIRNAME"/templates
cp -r "$DIR"/templates/default "$DIR"/"$OUTPUT_DIRNAME"/templates/default
cp -r "$DIR"/templates/blank "$DIR"/"$OUTPUT_DIRNAME"/templates/blank
cp -r "$DIR"/templates/uikit-ecommerce "$DIR"/"$OUTPUT_DIRNAME"/templates/uikit-ecommerce

mkdir "$DIR"/"$OUTPUT_DIRNAME"/public
cp "$DIR"/public/*.* "$DIR"/"$OUTPUT_DIRNAME"/public
cp "$DIR"/public/.htaccess "$DIR"/"$OUTPUT_DIRNAME"/public
rm "$DIR"/"$OUTPUT_DIRNAME"/public/package-lock.json
cp -r "$DIR"/public/app_build "$DIR"/"$OUTPUT_DIRNAME"/public
cp -r "$DIR"/public/css "$DIR"/"$OUTPUT_DIRNAME"/public
cp -r "$DIR"/public/img "$DIR"/"$OUTPUT_DIRNAME"/public
cp -r "$DIR"/public/js "$DIR"/"$OUTPUT_DIRNAME"/public
cp -r "$DIR"/public/bundles "$DIR"/"$OUTPUT_DIRNAME"/public/bundles
cp -r "$DIR"/public/assets "$DIR"/"$OUTPUT_DIRNAME"/public/assets
mkdir "$DIR"/"$OUTPUT_DIRNAME"/public/uploads

cp -r "$DIR"/public/admin "$DIR"/"$OUTPUT_DIRNAME"/public/admin
rm -rf "$DIR"/"$OUTPUT_DIRNAME"/public/admin/bundle-dev

mkdir "$DIR"/"$OUTPUT_DIRNAME"/public/node_modules
cp -r "$DIR"/public/node_modules/bootstrap "$DIR"/"$OUTPUT_DIRNAME"/public/node_modules
cp -r "$DIR"/public/node_modules/jquery "$DIR"/"$OUTPUT_DIRNAME"/public/node_modules
cp -r "$DIR"/public/node_modules/nouislider "$DIR"/"$OUTPUT_DIRNAME"/public/node_modules
cp -r "$DIR"/public/node_modules/slick-carousel "$DIR"/"$OUTPUT_DIRNAME"/public/node_modules
cp -r "$DIR"/public/node_modules/wnumb "$DIR"/"$OUTPUT_DIRNAME"/public/node_modules
cp -r "$DIR"/public/node_modules/fullcalendar "$DIR"/"$OUTPUT_DIRNAME"/public/node_modules
cp -r "$DIR"/public/node_modules/moment "$DIR"/"$OUTPUT_DIRNAME"/public/node_modules

mkdir "$DIR"/"$OUTPUT_DIRNAME"/frontend
cp "$DIR"/frontend/*.* "$DIR"/"$OUTPUT_DIRNAME"/frontend
cp -r "$DIR"/frontend/css "$DIR"/"$OUTPUT_DIRNAME"/frontend
cp -r "$DIR"/frontend/e2e "$DIR"/"$OUTPUT_DIRNAME"/frontend
cp -r "$DIR"/frontend/img "$DIR"/"$OUTPUT_DIRNAME"/frontend
cp -r "$DIR"/frontend/locale "$DIR"/"$OUTPUT_DIRNAME"/frontend
cp -r "$DIR"/frontend/src "$DIR"/"$OUTPUT_DIRNAME"/frontend

rm -rf "$DIR"/"$OUTPUT_DIRNAME"/bin/.phpunit
rm -rf "$DIR"/"$OUTPUT_DIRNAME"/vendor/andchir/digital-goods-bundle/.git
rm -rf "$DIR"/"$OUTPUT_DIRNAME"/vendor/andchir/import-export-bundle/.git
rm -rf "$DIR"/"$OUTPUT_DIRNAME"/vendor/andchir/omnipay-bundle/.git
rm -rf "$DIR"/"$OUTPUT_DIRNAME"/vendor/andchir/shopkeeper4-comments/.git
rm -rf "$DIR"/"$OUTPUT_DIRNAME"/vendor/andchir/twig-visual/.git
rm -rf "$DIR"/"$OUTPUT_DIRNAME"/vendor/andchir/twig-visual/src/Resources/src/node_modules

cd "${DIR:?}"/"${OUTPUT_DIRNAME:?}" || exit; zip -r -9 ../"${OUTPUT_FILENAME_FULL:?}" .
rm -rfv "${DIR:?}"/"${OUTPUT_DIRNAME:?}"/*
