#!/bin/sh
set -ex
MODE=${1:---release}
bunx wasm-pack build --no-pack --out-dir dist $MODE --target web
bunx tsc
