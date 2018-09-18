#! /bin/bash
set -e

SERVER=${1:-screen}

CMD='
tar xzf - -C /srv/smart-screen/
 && echo ≫ Replacing executable...
 && test -f /srv/smart-screen/smart-screen
 && mv /srv/smart-screen/smart-screen{,.old} || true
 && mv /srv/smart-screen/smart-screen{.new,}
 && echo ≫ Restarting service...
 && sudo systemctl daemon-reload
 && sudo service smart-screen restart
 && echo ≫ Checking status...
 && sudo service smart-screen status
 && echo ≫ Done
'

echo '≫ Transmitting executable "smart-screen.new" to "'${SERVER}'" remote...'
tar czf - smart-screen.new smart-screen.service html/ | ssh $SERVER $CMD
