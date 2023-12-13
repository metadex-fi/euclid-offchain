#!/bin/bash

# File path to package.json
PACKAGE_JSON="./package.json"

# Extract current version
CURRENT_VERSION=$(cat $PACKAGE_JSON | grep '"version":' | sed -E 's/.*"version": "([0-9]+\.[0-9]+\.[0-9]+)".*/\1/')
echo "Current version: $CURRENT_VERSION"

# Break the version number into its components
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"

# Increment the patch version
VERSION_PARTS[2]=$((${VERSION_PARTS[2]} + 1))

# Construct the new version
NEW_VERSION="${VERSION_PARTS[0]}.${VERSION_PARTS[1]}.${VERSION_PARTS[2]}"
echo "New version: $NEW_VERSION"

# Update package.json with the new version
sed -i '' "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" $PACKAGE_JSON
