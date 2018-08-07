#!/bin/bash
for if in scss/common scss/desktop scss/mobile
do
    i="$(basename "$if")"
    sassc scss/"${i}"/"${i}".scss "${i}"/"${i}".scss
    sed -i 's/var(--\([[:print:]]\+\))/\$\1/g' "${i}/${i}.scss"
done
cat es6/* > common/head_tag.html
