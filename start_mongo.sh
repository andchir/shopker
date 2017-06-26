#!/bin/bash

mongo_bin_path=$HOME/mongodb-linux-x86_64-ubuntu1604-3.4.2/bin

case "$1" in
    start)
        cd $mongo_bin_path && ./mongod --auth --dbpath ../data/db --fork --logpath=../mongodb.log
    ;;
    stop)
        cd $mongo_bin_path && ./mongod --dbpath ../data/db --shutdown
    ;;
    status)
        pgrep mongod
    ;;
    *)
        echo "Usage: ./start_mongo.sh {start|stop|status}"
        exit 1
esac

exit 0