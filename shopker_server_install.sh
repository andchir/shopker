#!/bin/bash

DIR="$(pwd)"
DOMAIN_NAME="shopker.localhost"
LOG_FILE_PATH="$DIR""/install.log"
GREEN="\e[32m"
RED="\e[31m"
GRAY="\e[2m"
BLUE="\e[94m\e[1m"
NC="\e[0m"

if [ "$1" == "-h" ]; then
    echo -e "$NC"
    echo -e "${BLUE}Использование: ./$(basename "$0") \"{DOMAIN_NAME}\""
    echo -e "$NC"
    exit 0
fi

if [ -n "$1" ]; then
    DOMAIN_NAME="$1"
fi

echo ""
echo -e "${BLUE}=== УСТАНОВКА MONGODB, PHP, NGINX (для Ubuntu 20.04 LTS) ==="
echo -e "$NC"
read -n1 -r -p "Нажмите клавишу ENTER для продолжения..." key
echo ""

if [ "$key" = '' ]; then

    echo -e "${GRAY}...Установка OpenPGP..."
    echo -e "$NC"

    GPG_PATH=$(command -v gpg)

    if [ ! -f "$GPG_PATH" ]; then
        apt install -y gnupg >> "$LOG_FILE_PATH" 2>> "$LOG_FILE_PATH";
        echo -e "${GREEN}Готово."
        echo -e "$NC"
    else
        echo -e "${GREEN}OpenPGP уже установлен. Следующий шаг..."
        echo -e "$NC"
    fi

    echo -e "${GRAY}...Установка MongoDB..."
    echo -e "$NC"

    MONGOD_PATH=$(command -v mongo)

    if [ ! -f "$MONGOD_PATH" ]; then
        if wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add - >> "$LOG_FILE_PATH" 2>> "$LOG_FILE_PATH"; then

            echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
            apt update >> "$LOG_FILE_PATH" 2>> "$LOG_FILE_PATH";
            apt install -y mongodb-org >> "$LOG_FILE_PATH" 2>> "$LOG_FILE_PATH";
            echo -e "${GREEN}Готово."
            echo -e "$NC"
        else
            echo -e "${RED}Невозможно импортировать GPG ключ."
            echo -e "$NC"
            exit 1
        fi
    else
        echo -e "${GREEN}MongoDB уже установлен. Следующий шаг..."
        echo -e "$NC"
    fi

    echo -e "${GRAY}...Запуск MongoDB..."
    echo -e "$NC"

    if service mongod start >> "$LOG_FILE_PATH" 2>> "$LOG_FILE_PATH"; then
        echo -e "${GREEN}Готово."
        echo -e "$NC"
    else
        echo -e "${RED}Невозможно запустить MongoDB."
        echo -e "$NC"
        exit 1
    fi

    echo -e "${GRAY}...Установка PHP..."
    echo -e "$NC"

    PHP_PATH=$(command -v php)

    if [ ! -f "$PHP_PATH" ]; then
        apt update >> "$LOG_FILE_PATH" 2>> "$LOG_FILE_PATH";
        apt install -y php-pear php7.4 php7.4-common php7.4-cli php7.4-fpm php7.4-curl php7.4-dev php7.4-gd php7.4-mbstring php7.4-zip php7.4-xml php7.4-fpm php7.4-imagick php7.4-tidy php7.4-xmlrpc php7.4-intl php7.4-mongodb >> "$LOG_FILE_PATH" 2>> "$LOG_FILE_PATH";
        echo -e "${GREEN}Готово. Версия PHP: $(php -r 'echo PHP_VERSION;')"
        echo -e "$NC"
    else
        echo -e "${GREEN}PHP уже установлен. Следующий шаг..."
        echo -e "$NC"
    fi

    echo -e "${GRAY}...Установка Nginx..."
    echo -e "$NC"

    NGINX_PATH=$(command -v nginx)

    if [ ! -f "$NGINX_PATH" ]; then
        apt update >> "$LOG_FILE_PATH" 2>> "$LOG_FILE_PATH";
        apt install -y nginx >> "$LOG_FILE_PATH" 2>> "$LOG_FILE_PATH";
        echo -e "${GREEN}Готово."
        echo -e "$NC"
    else
        echo -e "${GREEN}Nginx уже установлен. Следующий шаг..."
        echo -e "$NC"
    fi

    echo -e "${GRAY}...Создание конфигурации для домена Shopker..."
    echo -e "$NC"

    echo "server {
    listen 80;

    server_name ${DOMAIN_NAME};
    root /var/www/${DOMAIN_NAME}/public;

    location / {
        try_files \$uri /index.php\$is_args\$args;
    }

    location ~ ^/(index|check)\.php(/|$) {
        fastcgi_pass unix:/run/php/php7.4-fpm.sock;
        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME \$realpath_root\$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT \$realpath_root;
        internal;
    }

    location ~ \.php$ {
        return 404;
    }

    location = /favicon.ico {
        log_not_found off;
        access_log off;
    }

    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }

    location ~ /\. {
        deny all;
    }

    error_log /var/log/nginx/${DOMAIN_NAME}_error.log;
    access_log /var/log/nginx/${DOMAIN_NAME}_access.log;
}" | tee /etc/nginx/sites-available/default >> "$LOG_FILE_PATH" 2>> "$LOG_FILE_PATH"

    /etc/init.d/nginx reload >> "$LOG_FILE_PATH" 2>> "$LOG_FILE_PATH"

    echo -e "${GREEN}Установка завершена."
    echo -e "$NC"

else
    echo ""
    echo -e "${RED}ОТМЕНЕНО"
    echo -e "$NC"
fi
