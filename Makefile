# creates symbolic links to docvy-* modules for faster
# development
UP_DIR="$$(dirname $$PWD)"
node_modules: node_modules/docvy-plugin-installer node_modules/docvy-utils


node_modules/docvy-plugin-installer:
	ln -sf ${UP_DIR}/docvy-plugin-installer $$PWD/$@


node_modules/docvy-utils:
	ln -sf ${UP_DIR}/docvy-utils $$PWD/$@

