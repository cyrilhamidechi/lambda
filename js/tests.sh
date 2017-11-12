#!/bin/bash

logs='logs/app.log'

[ -d logs ] || logs
rm logs/app.log

echo "=== DEFAULT ===" >> $logs
node trigger.js >> $logs
echo "=== CUSTOM1 inlined ===" >> $logs
node trigger.js custom1 1 >> $logs
echo "=== CUSTOM2 ===" >> $logs
node trigger.js custom2 >> $logs
echo "=== NOTEVENT ===" >> $logs
node trigger.js notevent >> $logs

echo "=== GWGET ===" >> $logs
node trigger.js gwget >> $logs
echo "=== GWPUT ===" >> $logs
node trigger.js gwput >> $logs
echo "=== GWDEL ===" >> $logs
node trigger.js gwdel >> $logs

echo "=== S3PUT ===" >> $logs
node trigger.js s3put >> $logs
echo "=== S3DEL ===" >> $logs
node trigger.js s3del >> $logs

echo "=== SCHEDULED ===" >> $logs
node trigger.js scheduled >> $logs
#node trigger.js sns >> $logs
#node trigger.js code >> $logs
#node trigger.js cogsync >> $logs

