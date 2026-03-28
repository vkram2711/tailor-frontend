#!/bin/sh
set -e

# Substitute $PORT into nginx config (Render.com injects PORT, default 10000)
PORT=${PORT:-10000}
export PORT
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
