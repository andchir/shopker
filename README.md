Shopkeeper 4
============

~~~
php bin/console cache:clear --env=dev
php bin/console cache:clear --env=prod --no-debug
php bin/console server:run localhost:8001
~~~

~~~
cd /var/www/html/shopkeeper4
sudo chmod -R 0777 ./var
php bin/console cache:clear --env=prod --no-debug
~~~

Angular CLI
-----------

~~~
cd shk-app
~~~

~~~
ng serve --open --live-reload 0 --watch --port 4200 \
--output-path "/var/www/html/shopkeeper4/web/shk-app/dist_dev"
~~~

~~~
ng build --base-href "/" --watch \
--output-path "/var/www/html/shopkeeper4/web/shk-app/bundle"
~~~

~~~
ng build --base-href "/" \
--output-path "/var/www/html/shopkeeper4/web/shk-app/bundle"
~~~

Symfony Console Commands
------------------------

Commands list:
~~~
php bin/console
~~~

Execute a query and output the results:
~~~
php bin/console help doctrine:mongodb:query
~~~

Doctrine generate Getters and Setters:
~~~
php bin/console doctrine:mongodb:generate:documents AppBundle
~~~

Doctrine generate the repository class:
~~~
php bin/console doctrine:mongodb:generate:repositories AppBundle
~~~

DefinitelyTyped
---------------

https://github.com/DefinitelyTyped/DefinitelyTyped

~~~
npm install --save @types/jquery
~~~
~~~
// <reference path="node_modules/@types/jquery/jquery.d.ts"/>
~~~
~~~
npm install --save @types/lodash
~~~
~~~
import * as _ from "lodash";
~~~

MongoDB
-------

mongo shell - interactive JavaScript interface to MongoDB
[https://docs.mongodb.com/manual/mongo/](https://docs.mongodb.com/manual/mongo/)

mongod - primary daemon process for the MongoDB system
[https://docs.mongodb.com/manual/reference/program/mongod/](https://docs.mongodb.com/manual/reference/program/mongod/)

Enable Auth
[https://docs.mongodb.com/master/tutorial/enable-authentication/](https://docs.mongodb.com/master/tutorial/enable-authentication/)

~~~
cd /home/username/mongodb-linux-x.x.x/bin
~~~

Start mongod in background:
~~~
./mongod --dbpath ../data/db --fork --logpath=../mongodb.log
~~~

Start mongod with authentication in background:
~~~
./mongod --auth --dbpath ../data/db --fork --logpath=../mongodb.log
~~~

Start the mongo Shell:
~~~
./mongo
~~~

Connect and authenticate as the user administrator:
~~~
./mongo --port 27017 -u "root" -p "111111" --authenticationDatabase "admin"
~~~

Export:
~~~
./mongoexport --db shopkeeper4 --collection ContentType --out ../ContentType.json \
-u "shopkeeper4user" -p "111111" --authenticationDatabase "shopkeeper4"
~~~

Some commands:
~~~
show dbs
db
use <database>
show collections

db.first_collection.insert(
    {
        name: "test_name",
        type: "test_type",
        city: "Test city"
    }
)

db.first_collection.find()

db.first_collection.find().pretty()
~~~

~~~
use shopkeeper4
db.createUser(
  {
    user: "shopkeeper4user",
    pwd: "111111",
    roles: [ { role: "readWrite", db: "shopkeeper4" } ]
  }
)

use shopkeeper4
db.auth("shopkeeper4user", "111111")
~~~

Nginx configuration example
---------------------------

~~~
server {
    listen 80;

    server_name shopkeeper4;
    root /var/www/html/shopkeeper4/web;

    client_max_body_size 2000m;

    location / {
        try_files $uri /app.php$is_args$args;
        #try_files $uri /app_dev.php$is_args$args;
    }
    #DEV
    location ~ ^/(app_dev|config)\.php(/|$) {
        fastcgi_pass unix:/run/php/php7.0-fpm.sock;
        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;
    }
    # PROD
    location ~ ^/app\.php(/|$) {
        fastcgi_pass unix:/run/php/php7.0-fpm.sock;
        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;
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
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
        expires max;
        log_not_found off;
    }

    error_log /var/log/nginx/shopkeeper4_error.log;
    access_log /var/log/nginx/shopkeeper4_access.log;
}
~~~

