#!/bin/bash

logs=logs/app.log
node trigger.js > $logs
nano $logs
