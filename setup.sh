#! /bin/bash
set -e

SERVER=${1:-screen}

CMD='tar xzf - -C /tmp/
 && echo ≫ Making directory
 && sudo mkdir -p /srv/smart-screen/
 && echo ≫ Copying service
 && sudo cp /tmp/smart-screen.service /srv/smart-screen/
 && echo ≫ Enabling service
 && sudo systemctl enable /srv/smart-screen/smart-screen.service
'

echo 'Running command on "'${SERVER}'":' $CMD
tar czf - smart-screen.service |ssh $SERVER $CMD
