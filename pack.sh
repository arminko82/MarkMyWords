#!/bin/bash 
# This script packs the current project to a chrome extension zip
dir=${PWD##*/}
cd ..
zip "${dir}/MarkMyWords.zip" \
		"${dir}/manifest.json" \
		"${dir}/package.json" \
		"${dir}/main.js" \
		"${dir}/index.js" \
		"${dir}/index.html" \
		"${dir}/icon_16.png" \
		"${dir}/icon_128.png"
cd $dir