#!/bin/bash

git add -A
git commit -m "trigger electron deploy"

# #get highest tag number
# VERSION=`git describe --abbrev=0 --tags`

# #replace . with space so can split into an array
# VERSION_BITS=(${VERSION//./ })

# #get number parts and increase last one by 1
# VNUM1=${VERSION_BITS[0]}
# VNUM2=${VERSION_BITS[1]}
# VNUM3=${VERSION_BITS[2]}
# VNUM3=$((VNUM3+2))

# #create new tag
# NEW_TAG="$VNUM1.$VNUM2.$VNUM3"

# echo "Updating $VERSION to $NEW_TAG"

# git tag v1.0.1

git checkout prod
git merge staging
git push origin prod
git checkout staging