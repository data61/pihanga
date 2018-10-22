#!/bin/bash

cd $(dirname "$0")
F=./build/index.html

build() {
  test_for_npm
  [[ ! -d node_modules ]] && install_modules
  echo "[INFO]  Build UI"
  exec npm run build:prod
}

install_modules() {
  echo "[INFO]  Installing all required NPM packages"
  npm install
  [[ $? != 0 ]] && fatal "Problems installing NPM dependencies"
}

test_for_npm() {
  npm version > /dev/null 2>&1
  [[ $? != 0 ]] && fatal "Cannot find 'npm' executable on path"
}
 
fatal() {
  echo "[FATAL] $1"
  exit 1
} 

if [[ ! -r $F || -n $(find -f src node_modules -newer $F) ]]; then
  build
fi
exit 0
