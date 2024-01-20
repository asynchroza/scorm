#!/usr/bin/env sh
set -eu

envsubst '${NGINX_PUBLIC_AWS_BUCKET_HOST}' < /etc/nginx/nginx.conf > /etc/nginx/ownginx.conf
mv /etc/nginx/ownginx.conf /etc/nginx/nginx.conf

exec "$@"