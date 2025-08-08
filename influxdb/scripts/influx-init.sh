#!/bin/sh
set -e

influx user create \
  --name ${INFLUXDB_USER} \
  --password ${INFLUXDB_USER_PASSWORD}

influx auth create \
  --user ${INFLUXDB_USER} \
  --description "telegraf user token" \
  --read-buckets \
  --write-buckets \
  --read-telegrafs \
  --write-telegrafs
