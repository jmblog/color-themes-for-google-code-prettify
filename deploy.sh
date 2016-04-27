#!/usr/bin/env bash

if [ "$TRAVIS" = "true" ]
then
  git config --global user.email "yjimbo@gmail.com"
  git config --global user.name "Travis CI"
fi

./node_modules/.bin/gh-pages \
  --silent \
  --repo https://$GH_TOKEN@github.com/jmblog/color-themes-for-google-code-prettify.git \
  --dist dist
