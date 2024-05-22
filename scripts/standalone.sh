#!bin/bash

set -xe

pnpm build-local
mkdir .next/standalone/public && cp -aR public/* .next/standalone/public
mkdir .next/standalone/public/_next && cp -aR .next/static/ .next/standalone/public/_next
cd .next/
tar zcvf standalone.tar.gz standalone/
cd ..
ls -l .next/
