#!/usr/bin/bash

server="$(dirname $(dirname $(realpath $0)) )/serve.js"
entry_file="$(dirname $(realpath $0))/example.html"
port=8080

node "$server" -p "$port" --entry-file "$entry_file"
