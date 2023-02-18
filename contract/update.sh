#!/bin/bash

curl -X POST \
     -d '[]' \
     -H 'Content-Type: application/json' \
     localhost:3939/query-script/euclidValidator \
 | jq > euclidValidator.json

# curl -X POST \
#     -d '[]' \
#     -H 'Content-Type: application/json' \
#     localhost:3939/query-script/euclidMinting \
# | jq > euclidMinting.json

# curl -X POST \
#     -d '[]' \
#     -H 'Content-Type: application/json' \
#     localhost:3939/query-script/mintAlways \
# | jq > mintAlways.json

# curl -X POST \
#     -d '[]' \
#     -H 'Content-Type: application/json' \
#     localhost:3939/query-script/alwaysSucceeds0 \
# | jq > alwaysSucceeds.json