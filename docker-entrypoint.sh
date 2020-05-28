#!/usr/bin/env sh

if [ -z "$INPUT_TOKEN" ] || [ -z "$INPUT_ZONE" ] || [ -z "$INPUT_NAME" ]; then
  echo "One of the required params is empty. Please check all input params. Exiting..."
  exit 1
fi

node /usr/src/app/main.js >&1
