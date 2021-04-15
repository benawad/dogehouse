#!/bin/bash

set -e

git checkout prod
git merge staging
git push origin prod
git checkout staging