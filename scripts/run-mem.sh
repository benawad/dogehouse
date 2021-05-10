#!/bin/bash

docker-compose -f docker-compose.pg.yml up -d
yarn install
cd ../kebab
yarn build
cd ../kibbeh
yarn dev &
cd ../kousa
source .envrc
mix deps.get
mix ecto.migrate
iex -S mix