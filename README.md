# AngularJs + Ghost + SystemJS

A Skeleton Project for AngularJS using SystemJS using Ghost as an [NPM Module](https://github.com/TryGhost/Ghost/wiki/Using-Ghost-as-an-npm-module).

## Featrues
- ES6 via Babel
- AngularJS with ES6 modules via SystemJS
- SASS
- Ghost as an NPM module mounted on a subdirectory.

## Setup
```bash
# Step 1
npm install

# Step 2
jspm install
```
## Gulp Tasks
```bash
# Build Production and Serve
gulp serve --production

# Build Development and Serve
gulp serve --development
```

## Using Ghost
NOTE: Ghost is only served through the production build and is not available on development build.
You will also need to change ghost's ``config.js`` development url to ``url: 'http://localhost:9000/blog'``
```bash
gulp serve --production

cd server

node server.js
```


