# All of the dependencies are there, but Erlang OTP. Erlang
# and Elixir are missing!
FROM gitpod/workspace-full

# Install nj-cli, as needed for the globkeys
RUN cargo install nj-cli

# install required dependencies for building the client app for desktop
# ref: https://stackoverflow.com/a/55878577/11934990
RUN sudo apt-get install -y g++ gcc make pkg-config libx11-dev libxkbfile-dev libsecret-1-dev

# since Elixir needs Erlang, let's install them all.
RUN wget https://packages.erlang-solutions.com/erlang-solutions_2.0_all.deb \
    && sudo apt install ./erlang-solutions_2.0_all.deb \
    && rm erlang-solutions_2.0_all.deb \
    && wget https://packages.erlang-solutions.com/ubuntu/erlang_solutions.asc \
    && sudo apt-key add erlang_solutions.asc \
    ## Let's use the badass big esl-erlang package
    ## finger cross!
    && sudo apt update && sudo apt install -y esl-erlang elixir
