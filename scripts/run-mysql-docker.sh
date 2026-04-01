#!/usr/bin/env bash
# Starts MySQL without docker-compose v1 (avoids KeyError: ContainerConfig on Docker 25+).
# Uses mysql:8.0 — mysql:latest (9.x) removed support for default-authentication-plugin=mysql_native_password.
# If the container was created with a failed MySQL 9 init: docker rm -f earthworm-mysql-dev && npm run docker:mysql
# Default host port 3307 — set MYSQL_HOST_PORT=3306 to override.
set -euo pipefail

NAME="${EARTHWORM_MYSQL_CONTAINER:-earthworm-mysql-dev}"
PORT="${MYSQL_HOST_PORT:-3307}"

started=0
if docker ps --format '{{.Names}}' | grep -qx "$NAME"; then
  echo "MySQL container '$NAME' is already running (host port $PORT)."
else
  if docker ps -a --format '{{.Names}}' | grep -qx "$NAME"; then
    echo "Starting existing container '$NAME'..."
    docker start "$NAME"
  else
    echo "Creating MySQL container '$NAME' (localhost:$PORT -> container 3306)..."
    docker run -d --name "$NAME" \
      -e MYSQL_ROOT_PASSWORD=password \
      -e MYSQL_DATABASE=earthworm_dev \
      -p "${PORT}:3306" \
      mysql:8.0 \
      --default-authentication-plugin=mysql_native_password
  fi
  started=1
fi

if [ "$started" -eq 1 ] || ! docker exec "$NAME" mysqladmin ping -uroot -ppassword --silent 2>/dev/null; then
  echo "Waiting for MySQL to accept connections (up to ~90s)..."
  ready=0
  for _ in {1..90}; do
    if docker exec "$NAME" mysqladmin ping -uroot -ppassword --silent 2>/dev/null; then
      ready=1
      break
    fi
    sleep 1
  done
  if [ "$ready" -ne 1 ]; then
    echo "Timed out waiting for MySQL. Check: docker logs $NAME" >&2
    exit 1
  fi
  echo "MySQL is ready."
fi

echo "Use DATABASE_URL=mysql://root:password@127.0.0.1:${PORT}/earthworm_dev"
