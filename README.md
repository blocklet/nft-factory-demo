# NFT Factory Demo Blocklet

Blocklet that demos how you can mint NFT from NFT factory.

## Launch on Blocklet Server

[![Launch on Blocklet Server](https://assets.arcblock.io/icons/launch_on_blocklet_server.svg)](https://install.arcblock.io/?action=blocklet-install&meta_url=https%3A%2F%2Fgithub.com%2Fblocklet%2Fnft-factory-demo%2Freleases%2Fdownload%2Fv0.6.8%2Fblocklet.json)

## Run and debug in local

```shell
yarn global add @blocklet/cli
git clone git@github.com:blocklet/nft-factory-demo.git
cd nft-factory-demo
yarn
blocklet server init -f --mode debug
blocklet server start
blocklet dev
```

## License

The code is licensed under the Apache 2.0 license found in the
[LICENSE](LICENSE) file.
