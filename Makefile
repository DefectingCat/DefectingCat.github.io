PACKAGE_MANAGER = pnpm
NVM = nvm
DENO = deno

all: build

nvm:
	. ${NVM_DIR}/nvm.sh && nvm use && $(CMD)

deps:
	deno i

build:
	deno i && deno task build-local

.PHONY: all
