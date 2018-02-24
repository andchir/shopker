Shopkeeper 4
============

Product catalog and order management.

**Current version: ALPHA (in development)**

~~~
php bin/console doctrine:mongodb:fixtures:load --fixtures=src/AppBundle/DataFixtures/MongoDB/en
sudo -u www-data php bin/console cache:clear --env=dev
sudo -u www-data php bin/console cache:clear --env=prod --no-debug
php bin/console server:run localhost:8001
~~~

~~~
php bin/console cache:clear --env=prod --no-debug
~~~

Angular CLI
-----------

~~~
npm install -g @angular/cli@latest
~~~

~~~
ng serve --open --live-reload 0 --watch --port 4200 --output-path "./dist_dev"
~~~

~~~
ng build --base-href "/" --output-path "./bundle" --watch
~~~

~~~
ng build --prod --env=prod --base-href "/" --output-path "./bundle"
~~~

Fix changes watches for Linux:
~~~
sudo sysctl fs.inotify.max_user_watches=524288
sudo sysctl -p --system
~~~
https://confluence.jetbrains.com/display/IDEADEV/Inotify+Watches+Limit

**Angular internationalization (i18n)**

Extract translatable (ngx-translate) strings and save as a JSON:
~~~
npm run extract
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

MongoDB
-------

mongo shell - interactive JavaScript interface to MongoDB:
[https://docs.mongodb.com/manual/mongo/](https://docs.mongodb.com/manual/mongo/)

mongod - primary daemon process for the MongoDB system:
[https://docs.mongodb.com/manual/reference/program/mongod/](https://docs.mongodb.com/manual/reference/program/mongod/)

Enable Auth:
[https://docs.mongodb.com/master/tutorial/enable-authentication/](https://docs.mongodb.com/master/tutorial/enable-authentication/)

MongoDB Cloud:
[http://mbsy.co/jNpwD](http://mbsy.co/jNpwD)

Mongo Shell:
~~~
mongo
~~~

~~~
use admin
db.createUser(
    {
        user: "root",
        pwd: "mypassword",
        roles: [{role:"root", db:"admin"}]
    }
)
db.createUser(
    {
        user: "shopkeeper4user",
        pwd: "mypassword",
        roles: [{role: "readWrite", db: "shk4-db"}]
    }
)
~~~

~~~
use admin
db.auth('shopkeeper4user', 'mypassword')
~~~

Configure:
~~~
sudo nano /etc/mongod.conf
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

    client_max_body_size 200m;

    location / {
        try_files $uri /app.php$is_args$args;
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

Screenshots
-----------

![Shopkeeper 4 - screenshot #1](https://raw.github.com/andchir/shopkeeper4/master/docs/screenshots/001.png?raw=true "Shopkeeper 4 - screenshot #1")

![Shopkeeper 4 - screenshot #2](https://raw.github.com/andchir/shopkeeper4/master/docs/screenshots/002.png?raw=true "Shopkeeper 4 - screenshot #2")

![Shopkeeper 4 - screenshot #3](https://raw.github.com/andchir/shopkeeper4/master/docs/screenshots/003.png?raw=true "Shopkeeper 4 - screenshot #3")
