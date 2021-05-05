#!/usr/bin/env bash
docker-compose -f docker-compose.yml -f docker-compose.$1.yml ${@:2}
