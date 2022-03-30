#!/bin/bash

echo $(pwd)
dir=$(pwd)
cd ~/Saddle/saddle-contract
npm run start &
export APP_PID=$!
echo forked
echo "Hardhat ID: "$APP_PID
cd $dir
bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost:8545)" != "200" ]]; do sleep 5; done'
echo "starting test"
npm run cy:coveragestateful
echo "Shutting down hardhat server"
kill $APP_PID



