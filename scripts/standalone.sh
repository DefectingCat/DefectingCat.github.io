pnpm build-local
mkdir .next/standalone/public && cp -aR public/* .next/standalone/public
mkdir .next/standalone/public/_next && cp -aR .next/static/ .next/standalone/public/_next
tar zcvf .next/standalone.tar.gz .next/standalone/
ls -l .next/
