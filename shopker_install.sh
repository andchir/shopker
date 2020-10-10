#!/bin/bash

DIR="$(pwd)"
DOMAIN_NAME="shopker.localhost"
DOWNLOAD_URL=""
DOWNLOAD_FILENAME="shopker-latest.zip"
OWNER_USER="www-data"
OWNER_GROUP="www-data"
LOG_FILE_PATH="$DIR""/install-shopker.log"
GREEN="\e[32m"
RED="\e[31m"
GRAY="\e[2m"
BLUE="\e[94m\e[1m"
NC="\e[0m"

if [ "$1" == "-h" ]; then
    echo -e "$NC"
    echo -e "${BLUE}Использование: ./$(basename "$0") \"{DOWNLOAD_URL}\" \"{DOMAIN_NAME}\""
    echo -e "$NC"
    exit 0
fi

if [ -n "$1" ]; then
    DOWNLOAD_URL="$1"
fi

if [ -z "$DOWNLOAD_URL" ]; then
    echo -e "$NC"
    echo -e "Укажите URL для скачивания архива с файлами приложения. \"./$(basename "$0") -h\" - для справки"
    echo -e "$NC"
    exit 0
fi

if [ -n "$2" ]; then
    DOMAIN_NAME="$2"
    DIR="/var/www/""$DOMAIN_NAME"
fi

echo ""
echo -e "${BLUE}=== УСТАНОВКА SHOPKER ==="
echo -e "$NC"
read -n1 -r -p "Нажмите клавишу ENTER для продолжения..." key
echo ""

if [ "$key" = '' ]; then

    if [ ! -d "$DIR" ]; then
        mkdir "$DIR"
    fi

    echo -e "${GRAY}...Скачивание архива..."
    echo -e "$NC"

    if [ ! -f "$DIR"/"$DOWNLOAD_FILENAME" ]; then

        if wget -O "$DOWNLOAD_FILENAME" "$DOWNLOAD_URL" >> "$LOG_FILE_PATH" 2>> "$LOG_FILE_PATH"; then
            echo -e "${GREEN}Скачивание прошло успешно!"
            echo -e "$NC"
        else
            echo -e "${RED}ERROR: Невозможно скачать файл."
            echo -e "$NC"
            exit 1
        fi

    else
        echo -e "${GREEN}Файл уже загружен. Следующий шаг..."
        echo -e "$NC"
    fi

    echo -e "${GRAY}...Установка UNZIP..."
    echo -e "$NC"

    UNZIP_PATH=$(command -v unzip)

    if [ ! -f "$UNZIP_PATH" ]; then
        apt install -y unzip >> "$LOG_FILE_PATH" 2>> "$LOG_FILE_PATH";
        echo -e "${GREEN}Готово."
        echo -e "$NC"
    else
        echo -e "${GREEN}UNZIP уже установлен. Следующий шаг..."
        echo -e "$NC"
    fi

    echo -e "${GRAY}...Распаковка архива..."
    echo -e "$NC"

    if unzip "$DOWNLOAD_FILENAME" -d "$DIR" >> "$LOG_FILE_PATH" 2>> "$LOG_FILE_PATH"; then
        echo -e "${GREEN}Распаковка прошла успешно!"
        echo -e "$NC"
    else
        echo -e "${RED}ОШИБКА: Невозможно распаковать архив."
        echo -e "$NC"
        exit 1
    fi

    echo -e "${GRAY}...Настройка прав доступа..."
    echo -e "$NC"

    chown -R "$OWNER_USER":"$OWNER_GROUP" "$DIR"
    find "$DIR" -type d -exec chmod 755 {} \;
    find "$DIR" -type f -exec chmod 644 {} \;

    echo -e "${GREEN}Теперь Вы можете открыть сайт в браузере и продолжить установку."
    echo -e "$NC"

else
    echo ""
    echo -e "${RED}ОТМЕНЕНО"
    echo -e "$NC"
fi
