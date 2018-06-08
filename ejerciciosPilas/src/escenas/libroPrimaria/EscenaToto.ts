/// <reference path = "EscenaDesdeMapa.ts" />
/// <reference path = "../../actores/libroPrimaria/Toto.ts" />
/// <reference path = "../../actores/libroPrimaria/Letra.ts" />

/**
 * En esta escena, el zorro Toto se mueve por una cuadrícula de letras y las va leyendo.
 * A medida que el zorro lee las letras, estas van apareciendo en otra cuadrícula.
 */
abstract class EscenaToto extends EscenaDesdeMapa {
    automata : Toto;
    textoObjetivo : string;
    topeDeLetras : number;
    cuadriculaSecundaria : Cuadricula; // En esta cuadrícula van apareciendo las letras a medida que Toto lee.

    /**
     * @param mapaEscena Matriz bidimensional de strings a partir de la cual se crea la escena.
     * Toto se representa con una 'A' mayúscula. Las letras a leer van en minúscula
     * ('a', 'b', etc.). Los strings ' ' y '' representan casillas vacías.
     * @param textoObjetivo El texto que Toto debe leer. 
     * @param topeDeLetras Cantidad máxima de letras que Toto puede leer. Es opcional; por defecto
     * se toma la longitud de `textoObjetivo`.
     */
    constructor(
        mapaEscena : MapaEscena,
        textoObjetivo : string,
        topeDeLetras : number = 0
    ) {
        super(new GeneradorDeMapasSimple(mapaEscena));
        this.textoObjetivo = textoObjetivo;
        this.topeDeLetras = topeDeLetras > 0 ? topeDeLetras : this.textoObjetivo.length;
    }

    iniciar() {
        super.iniciar();

        this.cuadriculaSecundaria = this.construirCuadriculaSecundaria();
        // Toto debe conocer la cuadrícula secundaria (ver comportamiento 'MovimientoConLectura').
        this.automata.cuadriculaSecundaria = this.cuadriculaSecundaria;
    }

    ajustarGraficos() {
        this.automata.enviarAlFrente();
        this.automata.escala *= this.escalaSegunCuadricula(1.8);
    }

    mapearIdentificadorAActor(id, nroFila, nroColumna): ActorAnimado {
        switch(id) {
            case 'A': return this.automata;
            default: return new LetraTablero(id);
        }
    }

    abstract obtenerAutomata() : Toto;

    archivoFondo() {
        return "fondo.toto.png";
    }
    cuadriculaX() {
        return 0;
    }
    cuadriculaY() {
        return 80;
    }
    opsCuadricula() {
        return { ancho: 400, alto: 300 };
    }
    opsCasilla() {
        return { grilla: "casillas.toto.png", alto: this.mapaEscena.length === 1 ? 70 : undefined, cantColumnas: 16, bordesDecorados: true, relAspecto: 1 };
    }

    construirCuadriculaSecundaria() : Cuadricula {
        return new Cuadricula(
            0, -170, 1, this.topeDeLetras,
            { alto: 160 , ancho: 380, imagen: this.pathCuadriculaSecundaria()}, { grilla: 'invisible.png' }
        );
    }

    /**
     * Retorna el nombre de la imagen correspondiente al fondo de la cuadrícula secundaria.
     */
    abstract pathCuadriculaSecundaria() : string;

    /**
     * Devuelve en forma de string el contenido actual de la cuadrícula secundaria.
     */
    textoEnCuadriculaSecundaria() : string {
        let texto = "";
        this.cuadriculaSecundaria
            .filterCasillas(casilla => casilla.tieneActorConEtiqueta("Letra"))
            .forEach(casilla =>
                texto += casilla.actoresConEtiqueta("Letra")[0].caracter()
            );
        return texto;
    }

    estaResueltoElProblema() : boolean {
        return this.textoEnCuadriculaSecundaria() == this.textoObjetivo.toUpperCase();
    }
}
