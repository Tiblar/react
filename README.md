## Running in Docker

Start the api server then start this Docker project:

`docker-compose up --build`

All requests going to (/api, /captcha, etc) are rerouted to the api Docker container.

Next you can get a shell into the JS container with:
`docker exec -ti js /bin/bash`

Visit `localhost:8080` for the website.

## How to install

1. Install `npm`
2. Run `npm i`
3. Copy the constants template from `src/util/constants.js` to `src/util/constants.js`
4. You can now either build or run the development version

## Available Scripts

In the project directory, you can run:

### `npm start:dev`

### `npm run build`