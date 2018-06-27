#!/bin/bash
rm common/head_tag.html
touch common/head_tag.html
for i in $(find es6 templates -type f)
do
  echo >> common/head_tag.html
  cat $i >> common/head_tag.html
  echo >> common/head_tag.html
done
