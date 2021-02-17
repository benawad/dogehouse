# Contributing to DogeHouse
We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:
- Reporting a issue
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Code of Conduct
The code of conduct is described in [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md)

## Our Development Process
All changes happen through pull requests, Pull requests are the best way to propose changes. We actively welcome your pull requests and invite you to submit pull requests directly <a href="https://github.com/benawad/dogehouse/pulls">here</a> and, after review, these can be merged into the project.

## Pull Requests
1. Fork the repo and create your branch from `master`.
2. If you've added code that should be tested, add some tests' example.
3. Ensure to describe your pull request.

## Local Development
How to run locally
### Back-end
0. Install and start RabbitMQ
1. Install and start Postgresql
2. Create a DB inside Postgresql called `kousa_repo2`
3. Install Elixir
4. Inside `kousa` 
- run `mix deps.get`
- run `mix ecto.migrate`
- run `iex -S mix` (This starts the server, read all the error messages and add those environment variables)
5. Inside `shawarma`
- run `npm i`
- set an env variable `WEBRTC_LISTEN_IP` to `127.0.0.1`
- run `npm run build`
- run `npm start`
6. Inside `kofta`
- run `npm i`
- run `npm start`

(Austin lost power so I'm doing this from my phone, will make a better version soon)

## Issues
We use GitHub issues to track public bugs. Please ensure your description is
clear and has sufficient instructions to be able to reproduce the issue. Report a bug by <a href="https://github.com/benawad/dogehouse/issues">opening a new issue</a>; it's that easy!

## Frequently Asked Questions (FAQs) 
<!--- I thought it would be great to have a list of FAQs for the project to help save time for new contributors--->
    - Q: [The Question?]
    - A: [The Answer!]

## Feature Request
Great Feature Requests tend to have:

- A quick idea summary
- What & why you wanted to add the specific feature
- Additional Context like images, links to resources to implement the feature etc etc.

## License
By contributing to DogeHouse, you agree that your contributions will be licensed
under the LICENSE file in the root directory of this source tree.
