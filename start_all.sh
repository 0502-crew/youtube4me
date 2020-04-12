#!/bin/sh

# Reset to master in case any force pushes were done
git reset --hard origin/master
# Start client server
cd client && npm i && npm run build && nohup npm run prod &
# Start api server
cd api && npm i && npm run build && nohup npm run prod &
# Keep server running by tailing nothing, forever...
tail -f /dev/null