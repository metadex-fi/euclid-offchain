#!/bin/bash

curl -X POST \
     -d '[]' \
     -H 'Content-Type: application/json' \
     localhost:3939/query-script/diracValidator \
 | jq > diracValidator.json

curl -X POST \
    -d '[]' \
    -H 'Content-Type: application/json' \
    localhost:3939/query-script/diracMinting \
| jq > diracMinting.json