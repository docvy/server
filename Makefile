# creates symbolic links to docvy-* modules for faster
# development
UP_DIR="$$(dirname $$PWD)"
links: node_modules \
  node_modules/docvy-cache \
  node_modules/docvy-plugin-installer \
  node_modules/docvy-utils


node_modules:
	mkdir -p node_modules


node_modules/docvy-cache:
	ln -sf ${UP_DIR}/docvy-cache $$PWD/$@


node_modules/docvy-plugin-installer:
	ln -sf ${UP_DIR}/docvy-plugin-installer $$PWD/$@


node_modules/docvy-utils:
	ln -sf ${UP_DIR}/docvy-utils $$PWD/$@

