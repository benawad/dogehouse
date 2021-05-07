# kousa
cat >> "/home/$USERNAME/.bashrc" << EOL

# Kousa environment variables 
export DATABASE_URL=postgres://postgres:postgres@localhost/kousa_repo2
export BEN_GITHUB_ID=7872329
export RABBITMQ_URL=amqp://guest:guest@localhost:5672
export ACCESS_TOKEN_SECRET=
export REFRESH_TOKEN_SECRET=
export GITHUB_CLIENT_ID=
export TWITTER_API_KEY=
export TWITTER_SECRET_KEY=
export TWITTER_BEARER_TOKEN=
export GITHUB_CLIENT_SECRET=
export DISCORD_CLIENT_ID=
export DISCORD_CLIENT_SECRET=
export GOOGLE_CLIENT_ID=
export GOOGLE_CLIENT_SECRET=
export SENTRY_DNS=
export API_URL=http://localhost:4001
export WEB_URL=http://localhost:3000
export PORT=4001
EOL

# shawarma
echo "WEBRTC_LISTEN_IP=127.0.0.1" > shawarma/.env

# kibbeh
cp kibbeh/.env.example kibbeh/.env
