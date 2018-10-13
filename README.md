Setup a remote server with this guideline https://gist.github.com/karl-gustav/301a9ff5e6f1e89591ffaeef84593dca

Setup ssh autologin with the name "screen" in ~/.ssh/config

Run "./setup.sh"

Run "./build.sh && ./deploy.sh"

If you have another name for the server in ssh/config you can put that after the deploy script,
i.e. `./build.sh && ./deploy.sh <my server name>`

PS: This project uses git submodules for it's go dependencies.