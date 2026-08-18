#!/bin/sh
# Kept for Railway's railway.json (`deploy.startCommand: "sh start.sh"`).
# The real start sequence lives in docker-entrypoint.sh — it's also the
# Dockerfile's ENTRYPOINT — so there is a single source of truth instead of
# two scripts that can silently drift apart.
set -e
exec sh "$(dirname "$0")/docker-entrypoint.sh"
