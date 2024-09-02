PACKAGE_MANAGER = pnpm
NVM = nvm

all: build

nvm:
	. ${NVM_DIR}/nvm.sh && nvm use && $(CMD)

deps:
	make nvm CMD="$(PACKAGE_MANAGER) i"

build:
	make nvm CMD="$(PACKAGE_MANAGER) i && $(PACKAGE_MANAGER) build-local"

.PHONY: all
