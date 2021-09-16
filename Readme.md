# livioo-live-server

[![Npm](https://img.shields.io/npm/v/livioo-live-server)](https://www.npmjs.com/package/livioo-live-server)
[![Npm](https://img.shields.io/npm/dm/livioo-live-server)](https://www.npmjs.com/package/livioo-live-server)
[![License](https://img.shields.io/npm/l/livioo-live-server)](LICENSE)

> Experimental

a simple web server inspired by [live-server](https://www.npmjs.com/package/live-server)

difference from `live-server`:

- can use local resources such as images in your html file

## Install

```js
npm install -g livioo-live-server
```
## Usage

By default, this server will find the index.html under current dir, then serve it on http://localhost:3000

like code below
```bash
livioo-live-server
```

You can config options to achieve what you want, these are options currently support

- `-p, --port`, the port server runs on, default 3000
- `--entry-file`, the html to be served, default index.html, not support dir yet
- `--static-dir`, the resources dir to be served, default public
- to be continue...

## Repo
https://github.com/UI-Mario/livioo-live-server