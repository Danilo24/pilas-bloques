# El version y nombre son los que figuran en el package.json.
VERSION=$(shell scripts/obtenerVersion.sh)
# El NOMBRE lo usa el empaquetador para crear archivos y carpetas y para darle nombre a los binarios
NOMBRE=$(shell scripts/obtenerNombre.sh)
# La ruta del ejecutable de ember
EMBER=./node_modules/.bin/ember

N=[0m
G=[01;32m
Y=[01;33m
B=[01;34m
L=[01;30m

npm_config_loglevel="warn"

comandos:
	@echo ""
	@echo "${B}Comandos disponibles para ${G}pilas-bloques${N} - ${Y} versión ${VERSION}${N}"
	@echo ""
	@echo "  ${Y}Para desarrolladores${N}"
	@echo ""
	@echo "    ${G}compilar${N}        Genera los archivos compilados."
	@echo "    ${G}compilar_live${N}   Compila de forma contínua."
	@echo "    ${G}compilar_web${N}    Genera la aplicación para la versión web (desde un iframe)."
	@echo "    ${G}test_travis${N}     Ejecuta las pruebas como esperamos en travis (en paralelo)."
	@echo ""
	@echo "    ${L}El comando full es equivalente a realizar estos pasos en orden:${N}"
	@echo "${L}"
	@echo ""
	@echo "  ${Y}Para distribuir${N}"
	@echo ""
	@echo "    ${G}version_patch${N}     Genera una versión (0.0.PATCH)."
	@echo "    ${G}version_minor${N}     Genera una versión (0.MINOR.0)."
	@echo "    ${G}version_major${N}     Genera una versión (MAJOR.0.0)."
	@echo ""
	@echo "    ${L}NOTA: toda versión genera un binario automáticamente en travis, ${N}"
	@echo "    ${L}      y solamente las versiones minor y major serán distribuidas${N}"
	@echo "    ${L}      oficialmente. Las versiones patch son internas o de prueba.${N}"
	@echo ""
	@echo "    ${G}empaquetar${N}          Genera los binarios de forma local."
	@echo ""
	@echo ""
	@echo ""


compilar_ejercicios_pilas: # Para cuando se quiere probar los cambios a ejercicios_pilas SIN releasearlo
	echo "${G}Compilando ejercicios para Pilas Bloques${N}"
	@cd ../pilas-bloques-exercises; node_modules/grunt-cli/bin/grunt
	@cp -rf ../pilas-bloques-exercises/dist node_modules/pilas-bloques-exercises/

watch_ejercicios: 
	echo "${G}Compilando ejercicios para Pilas Bloques${N}"
	@cd ../pilas-bloques-exercises; node_modules/grunt-cli/bin/grunt watch

build: 
	@npm run build

compilar_web: $(EMBER) build --environment=web --output-path dist_web

compilar_live:
	$(EMBER) build --watch

compilar_pilasweb: # Para cuando se quiere probar los cambios a pilasweb SIN releasearlo
	cd ../pilasweb; make build
	cp -rf ../pilasweb/dist node_modules/pilasweb/

version_patch:
	$(EMBER) release

version_minor:
	$(EMBER) release --minor

version_major:
	$(EMBER) release --major

empaquetar: build _preparar_electron _empaquetar_osx _empaquetar_win32 _empaquetar_linux
	@echo "${G}Listo, los binarios se generaron en el directorio 'binarios'.${N}"

_preparar_electron:
	@echo "${G}Preparando directorio dist para funcionar con electron...${N}"
	@cp package.json dist/package.json
	@cp packaging/electron.js dist

empaquetar = @echo "${G}Empaquetando binarios para $(1) $(2)...${N}"; node_modules/.bin/electron-packager dist ${NOMBRE} --app-version=${VERSION} --platform=$(1) --arch=$(2) --ignore=node_modules --out=binarios --overwrite --icon=packaging/icono.$(3)

_empaquetar_osx:
	rm -f binarios/${NOMBRE}-${VERSION}.dmg
	$(call empaquetar,darwin,all,icns)
	hdiutil create binarios/${NOMBRE}-${VERSION}.dmg -srcfolder ./binarios/${NOMBRE}-darwin-x64/${NOMBRE}.app -size 1g

_empaquetar_win32:
	$(call empaquetar,win32,ia32,ico)
	@echo "${G}Generando instalador para windows...${N}"
	cp packaging/instalador.nsi binarios/${NOMBRE}-win32-ia32/
	cd binarios/${NOMBRE}-win32-ia32/; makensis instalador.nsi
	@mv binarios/${NOMBRE}-win32-ia32/${NOMBRE}.exe binarios/${NOMBRE}-${VERSION}.exe

_empaquetar_linux: _borrar_binarios_linux _empaquetar_zip_linux_x64 _empaquetar_zip_linux_ia32 _empaquetar_deb_linux_x64

_borrar_binarios_linux:
	rm -rf binarios/${NOMBRE}-*linux*
	rm -rf binarios/*.deb

# Este empaquetado tiene el problema de que NO reemplaza la aplicación vieja de Huayra.
# Además, el package debian generado tiene nombre diferente al viejo.
_empaquetar_deb_linux_x64:
	$(call empaquetar,linux,x64,icns)
	node_modules/.bin/electron-installer-debian --arch amd64 --config=packaging/linux-package.json

_empaquetar_zip_linux_x64:
	$(call empaquetar,linux,x64,icns)
	cd binarios; zip -r ${NOMBRE}-${VERSION}-linux-x64.zip ${NOMBRE}-linux-x64/

_empaquetar_zip_linux_ia32:
	$(call empaquetar,linux,ia32,icns)
	cd binarios; zip -r ${NOMBRE}-${VERSION}-linux-ia32.zip ${NOMBRE}-linux-ia32/

# Antes de correr este comando leer Requirements en
# https://www.npmjs.com/package/electron-installer-flatpak
_empaquetar_flatpak_linux_64:
	$(call empaquetar,linux,x64,icns)
	node_modules/.bin/electron-installer-flatpak --arch x64 --config=packaging/linux-package.json
	mv binarios/io.atom.electron.${NOMBRE}_master_x64.flatpak binarios/${NOMBRE}-${VERSION}-x64.flatpak

.PHONY: build
