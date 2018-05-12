/// <reference path = "../../dependencias/pilasweb.d.ts" />
/// <reference path = "../habilidades/Animar.ts" />
/// <reference path = "../escenas/Errores.ts" />

/**
 * @class ActorAnimado
 *
 * Representa un actor que tiene una animación cuando se mueve.
 * Las opciones deben incluir la grilla (imagen) y la cantidad de cuadros que tiene,
 * ó bien la grilla y la lista de cuadros que representan la animación. También puede
 * incluir el cuadroEstatico, que es el cuadro que se muestra al estar parado.
 *
 * Por ejemplo:
 *      @example
 *      miActor = new ActorAnimado(0,0,...documentación en ptrogreso...);
 *      miActor.hacer_luego(CaminaDerecha,{pasos: 2});
 */
class ActorAnimado extends Actor {
    opciones;
    _casillaActual;
    cuadricula;
    objetosRecogidos;
    pausado;
    habilidadesSuspendidas;


    constructor(x, y, opciones) {
        this.desPausar();
        this.sanitizarOpciones(opciones);
        super(this.animacionPara(this.opciones.grilla), x, y);
        this.z = pilas.escena_actual().minZ() - 1;

        this.setupAnimacion();

        this.objetosRecogidos = [];
        this.habilidadesSuspendidas = [];
    }

    pre_actualizar(){
        if (!this.pausado) super.pre_actualizar();
    }

    pausar(){
        this.pausado = true;
    }

    desPausar(){
        this.pausado = false;
    }

    sanitizarOpciones(ops){
        this.opciones = ops;
        this.opciones.cuadrosCorrer = ops.cuadrosCorrer || this.seguidillaHasta(ops.cantColumnas) || [0];
        this.opciones.cuadrosParado = ops.cuadrosParado || [0];
        this.opciones.cuadrosError = ops.cuadrosError || this.opciones.cuadrosParado;
        this.opciones.cantColumnas = ops.cantColumnas || this.opciones.cuadrosCorrer.length;
        this.opciones.cantFilas = ops.cantFilas || 1;
    }

    mover(x,y) {
        this.x += x;
        this.y += y;
        this.pasito_correr();
    }

    definirAnimacion(nombre, cuadros, velocidad, cargarla = false){
        this._imagen.definir_animacion(nombre, cuadros, velocidad);
        if (cargarla) this.cargarAnimacion(nombre);
    }

    pasito_correr() {
        this.cargarAnimacion("correr");
        this._imagen.avanzar();
    }

    tocando(etiqueta) : Boolean {
      return pilas.obtener_actores_con_etiqueta(etiqueta).some(objeto => objeto.colisiona_con(this));
    }

		objetoTocado(etiqueta) {
			return pilas.obtener_actores_con_etiqueta(etiqueta).filter(objeto => objeto.colisiona_con(this))[0];
		}

    hayAbajo():Boolean{
      return this.cuadricula.hayAbajo(this.casillaActual());
    }
    hayArriba():Boolean{
      return this.cuadricula.hayArriba(this.casillaActual());
    }
    hayDerecha():Boolean{
      return this.cuadricula.hayDerecha(this.casillaActual());
    }
    hayIzquierda():Boolean{
      return this.cuadricula.hayIzquierda(this.casillaActual());
    }

    tieneEnLaCasillaDeArriba(etiqueta : String) : Boolean {
        if (this.hayArriba()) {
            return this.casillaActual().casillaDeArriba().tieneActorConEtiqueta(etiqueta);
        }
        else {
            throw new ActividadError("¡No hay nada para ver arriba!")
        }
    }
    tieneEnLaCasillaDeAbajo(etiqueta: String): Boolean {
        if (this.hayAbajo()) {
            return this.casillaActual().casillaDeAbajo().tieneActorConEtiqueta(etiqueta);
        }
        else {
            throw new ActividadError("¡No hay nada para ver abajo!")
        }
    }
    tieneEnLaCasillaASuIzquierda(etiqueta : String) : Boolean {
        if (this.hayIzquierda()) {
            return this.casillaActual().casillaASuIzquierda().tieneActorConEtiqueta(etiqueta);
        }
        else {
            throw new ActividadError("¡No hay nada para ver a la izquierda!")
        }
    }
    tieneEnLaCasillaASuDerecha(etiqueta : String) : Boolean {
        if (this.hayDerecha()) {
            return this.casillaActual().casillaASuDerecha().tieneActorConEtiqueta(etiqueta);
        }
        else {
            throw new ActividadError("¡No hay nada para ver a la derecha!")
        }
    }            

    tocandoFlechaAbajo():Boolean {
      if (this.alFinalDelCamino()) throw new ActividadError("No se puede preguntar más, ya estoy al final del camino");
      return this.hayAbajo();
    }
    tocandoFlechaDerecha():Boolean {
      if (this.alFinalDelCamino()) throw new ActividadError("No se puede preguntar más, ya estoy al final del camino");
      return this.hayDerecha();
    }

    alFinalDelCamino():Boolean{
        return ! this.casillaActual().hayAbajo() && ! this.casillaActual().hayDerecha();
    }

    estoyUltimaFila() : Boolean {
      return this.cuadricula.cantFilas-1==this.casillaActual().nroFila;
    }

    cambiarImagen(nombre){
        this.imagen = this.animacionPara(nombre);
    }

    animacionPara(nombre) {
        return pilas.imagenes.cargar_animacion(nombre, this.opciones.cantColumnas, this.opciones.cantFilas);
    }

    tocandoFin() : Boolean {
      return this.casillaActual().casillaASuDerecha()==undefined
    // return  pilas.escena_actual().cuadricula.tocandoFin(this)
    // cada cuadricula (multiple,esparsa,etc) implementa su tocandoFin de manera diferente
    }

    tocandoInicio() : Boolean {
      return this.casillaActual().nroColumna==0;
    }

    setupAnimacion(){
        this.definirAnimacion("correr", this.opciones.cuadrosCorrer, 5);
        this.definirAnimacion("parado", this.opciones.cuadrosParado, 5);
        this.definirAnimacion("error", this.opciones.cuadrosError, 5);
        this.animar();
        this.cargarAnimacion("parado");
    }

    detenerAnimacion(){
        this.olvidar(Animar);
    }

    animar(){
        this.aprender(Animar, {}); //Hace la magia de animar constantemente.
    }

    cargarAnimacion(nombre){
    	this._imagen.cargar_animacion(nombre);
    }

    avanzarAnimacion() : Boolean {
    	return !this._imagen.avanzar();
    }

    cantidadDeSprites() : Number {
        return this._imagen.animacion_en_curso.cuadros.length;
    }

    nombreAnimacionActual() : String {
        return this._imagen.animacion_en_curso.nombre;
    }

    ponerMaximaVelocidad(){
      for (var nombre in this._imagen.animaciones){
        this._imagen.animaciones[nombre].velocidad = 60;
      }
    }

    seguidillaHasta(nro){
        var seguidilla = [];
        if(nro !== undefined) {
            for(var i = 0; i < nro; i++){
                seguidilla.push(i);
            }
        } else {
            seguidilla.push(0);
        }
        return seguidilla;
    }

    clonar(){
        /*var clon =*/ return new (<any>this).constructor(this.x, this.y, this.opciones);
        /*for (var attr in this){
            if(typeof this[attr] != "function"){
                clon[attr] = this[attr];
            }
        }
        return clon;*/
    }

    //TODO poner en otra clase lo q tenga q ver con casillas
    casillaActual(){
        return this._casillaActual;
    }
    setCasillaActual(casillaNueva, moverseAhi=false){
        if(this._casillaActual) this._casillaActual.eliminarActor(this);
        this._casillaActual = casillaNueva;
        casillaNueva.agregarActor(this);
        if (moverseAhi){
            this.x = casillaNueva.x;
            this.y = casillaNueva.y;
        }
    }
    estaEnCasilla(nroFila,nroColumna){
      return this.casillaActual().sos(nroFila,nroColumna);
    }

    largoColumnaActual(){
      return this.cuadricula.largoColumna(this.casillaActual().nroColumna);
    }

    cuando_busca_recoger() {
        pilas.escena_actual().intentaronRecoger();
    }
    recoger(a) {
        pilas.escena_actual().intentaronRecoger(a);
    }

    informarError(error: ActividadError){
        this.hacer(Decir, {mensaje: error.message, nombreAnimacion: error.nombreAnimacion, autoEliminar: false});
    }

    // TODO: Esto debería estar en Estudiante, en pilasweb.
    eliminar_comportamientos(){
        this.comportamiento_actual = undefined;
        this.comportamientos = [];
    }
    
    colisiona_con(objeto) : Boolean {
      if(this.cuadricula){
        return this.cuadricula.colisionan(this,objeto);
      }else{
        return super.colisiona_con(objeto)
      }

    }

    suspenderHabilidadesConMovimiento(){
        this.habilidadesSuspendidas = this.habilidadesSuspendidas.concat(
            this.habilidades.filter( hab => hab.implicaMovimiento() ));
        this.habilidadesSuspendidas.forEach( hab => this.olvidar(hab));
    }
    activarHabilidadesConMovimiento(){
        this.habilidadesSuspendidas.forEach(function(hab) {
            hab.actualizarPosicion();
            this.aprender(hab);
        }.bind(this));
        this.habilidadesSuspendidas = [];
    }
    enviarAlFrente(){
        this.setZ(Math.min.apply(Math,pilas.escena_actual().actores.map(act => act.getZ()))-1);
    }

}

// Helper para construir las animaciones:
class Cuadros {
    _lista :Array<Number>;
    constructor(nroOLista){
        this._lista = (typeof (nroOLista) === "number") ? [nroOLista] : nroOLista;
    }
    repetirVeces(veces){
        var lOrig = this._lista;
        for (var i = 0; i < veces-1; i++) {
            this._lista = this._lista.concat(lOrig);
        }
        return this._lista;
    }
    repetirRandom(veces){
        return this.repetirVeces(Math.round(Math.random() * veces));
    }
    lista(){
        return this._lista;
    }
}
