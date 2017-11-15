#!/bin/bash

logs='logs/app.log'

[ -d logs ] || mkdir logs
[ -f logs/app.log ] && rm logs/app.log

[ $1 ] && rm logs/*

#sns, code, cogsync
events=(custom1 inlined custom2 notevent invalid gwget gwput gwdel s3put s3del)
for i in "${events[@]}"
do
  echo "=== $i ===" >> $logs
  case "$i" in
    custom1)
      node trigger.js | tee -a $logs logs/$i.log >/dev/null
      ;;
    inlined)
      node trigger.js custom1 1 | tee -a $logs logs/$i.log >/dev/null
      ;;
    *)
      node trigger.js $i | tee -a $logs logs/$i.log >/dev/null
  esac
done
