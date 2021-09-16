#!/usr/bin/bash

server="$(dirname $(dirname $(realpath $0)) )/serve.js"
entry_file="./example.html"
port=8080
static_dir="./public"

node "$server" -p "$port" --entry-file "$entry_file" --static-dir "$static_dir"
