#!/bin/bash -x

echo "1/2) Building Process ..."
gulp
echo "1/2) Stopping existing node process ..."
forever stop apis

echo "2/2) Starting node process ..."
echo "3/7) Starting node process ..."
sudo lsof -t -i tcp:3000 -s tcp:listen | sudo xargs kill
forever start --uid "apis" -a -c node dist/index.js

echo "Deployment complete"
