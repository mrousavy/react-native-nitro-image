#!/bin/bash

set -e

echo "Starting the release process..."
echo "Provided options: $@"

echo "Publishing 'react-native-nitro-image' to NPM"
cd packages/react-native-nitro-image
cp ../../README.md README.md
bun release $@
rm README.md

echo "Publishing 'react-native-nitro-web-image' to NPM"
cd ../react-native-nitro-web-image
cp ../../README.md README.md
bun release $@
rm README.md

echo "Creating a Git bump commit and GitHub release"
cd ../..
bun run release-it $@

echo "Successfully released NitroImage!"
