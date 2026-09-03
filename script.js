/* =========================================
   MAYITO DETALLES
   CONTROL DE INGRESOS
========================================= */


let shows =
    JSON.parse(
        localStorage.getItem("mayitoShows")
    ) || [];


/* =========================================
   ELEMENTOS
========================================= */

const formulario =
    document.getElementById("formShow");

const tablaShows =
    document.getElementById("tablaShows");

const mensajeVacio =
    document.getElementById("mensajeVacio");


const totalIngresos =
    document.getElementById("totalIngresos");

const totalGastos =
    document.getElementById("totalGastos");

const totalGanancia =
    document.getElementById("totalGanancia");

const totalShows =
    document.getElementById("totalShows");


/* CAMPOS */

const campoFecha =
    document.getElementById("fecha");

const campoShow =
    document.getElementById("show");

const campoPrecio =
    document.getElementById("precio");

const campoMovilidad =
    document.getElementById("movilidad");

const campoDescuentoMovilidad =
    document.getElementById("descuentoMovilidad");

const campoTrabajador =
    document.getElementById("trabajador");

const campoOtros =
    document.getElementById("otros");


const gastoActual =
    document.getElementById("gastoActual");

const gananciaActual =
    document.getElementById("gananciaActual");


/* =========================================
   DINERO
========================================= */

function dinero(numero) {

    return new Intl.NumberFormat(
        "es-PE",
        {
            style: "currency",
            currency: "PEN"
        }
    ).format(numero);

}


/* =========================================
   NÚMERO
========================================= */

function numero(valor) {

    return Number(valor) || 0;

}


/* =========================================
   CALCULAR PREVISUALIZACIÓN
========================================= */

function calcularFormulario() {

    const precio =
        numero(campoPrecio.value);

    const movilidad =
        numero(campoMovilidad.value);

    const descuentoMovilidad =
        numero(
            campoDescuentoMovilidad.value
        );

    const trabajador =
        numero(campoTrabajador.value);

    const otros =
        numero(campoOtros.value);


    const gastos =
        movilidad +
        descuentoMovilidad +
        trabajador +
        otros;


    const ganancia =
        precio - gastos;


    gastoActual.textContent =
        dinero(gastos);


    gananciaActual.textContent =
        dinero(ganancia);


    if (ganancia < 0) {

        gananciaActual.style.color =
            "#ef4444";

    } else {

        gananciaActual.style.color =
            "#10b981";

    }

}


/* =========================================
   CALCULAR MIENTRAS ESCRIBE
========================================= */

[
    campoPrecio,
    campoMovilidad,
    campoDescuentoMovilidad,
    campoTrabajador,
    campoOtros

].forEach(campo => {

    campo.addEventListener(
        "input",
        calcularFormulario
    );

});


/* =========================================
   GUARDAR
========================================= */

function guardarDatos() {

    localStorage.setItem(
        "mayitoShows",
        JSON.stringify(shows)
    );

}


/* =========================================
   FECHA
========================================= */

function formatearFecha(fecha) {

    if (!fecha) {
        return "";
    }


    const partes =
        fecha.split("-");


    if (partes.length !== 3) {
        return fecha;
    }


    return `
        ${partes[2]}/
        ${partes[1]}/
        ${partes[0]}
    `;

}


/* =========================================
   ESCAPAR HTML
========================================= */

function escaparHTML(texto) {

    const div =
        document.createElement("div");

    div.textContent = texto;

    return div.innerHTML;

}


/* =========================================
   MOSTRAR SHOWS
========================================= */

function mostrarShows() {

    tablaShows.innerHTML = "";


    if (shows.length === 0) {

        mensajeVacio.style.display =
            "block";

        actualizarResumen();

        return;

    }


    mensajeVacio.style.display =
        "none";


    shows
        .slice()
        .reverse()
        .forEach(
            (show, posicion) => {

                const indiceReal =
                    shows.length -
                    1 -
                    posicion;


                const fila =
                    document.createElement("tr");


                fila.innerHTML = `

                    <td>
                        ${formatearFecha(show.fecha)}
                    </td>


                    <td>
                        <strong>
                            ${escaparHTML(show.nombre)}
                        </strong>
                    </td>


                    <td>
                        ${dinero(show.precio)}
                    </td>


                    <td>
                        ${dinero(show.movilidad)}
                    </td>


                    <td>
                        ${dinero(show.descuentoMovilidad)}
                    </td>


                    <td>
                        ${dinero(show.trabajador)}
                    </td>


                    <td>
                        ${dinero(show.otros)}
                    </td>


                    <td class="gasto-tabla">
                        ${dinero(show.gastos)}
                    </td>


                    <td class="ganancia-tabla">
                        ${dinero(show.ganancia)}
                    </td>


                    <td>

                        <button
                            class="btn-eliminar"
                            onclick="eliminarShow(${indiceReal})"
                            title="Eliminar show"
                        >
                            🗑️
                        </button>

                    </td>

                `;


                tablaShows.appendChild(fila);

            }
        );


    actualizarResumen();

}


/* =========================================
   AGREGAR SHOW
========================================= */

formulario.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const fecha =
            campoFecha.value;


        const nombre =
            campoShow.value.trim();


        const precio =
            numero(campoPrecio.value);


        const movilidad =
            numero(campoMovilidad.value);


        const descuentoMovilidad =
            numero(
                campoDescuentoMovilidad.value
            );


        const trabajador =
            numero(campoTrabajador.value);


        const otros =
            numero(campoOtros.value);


        const gastos =
            movilidad +
            descuentoMovilidad +
            trabajador +
            otros;


        const ganancia =
            precio - gastos;


        const nuevoShow = {

            id:
                Date.now(),

            fecha,

            nombre,

            precio,

            movilidad,

            descuentoMovilidad,

            trabajador,

            otros,

            gastos,

            ganancia

        };


        shows.push(nuevoShow);


        guardarDatos();

        mostrarShows();


        formulario.reset();


        campoMovilidad.value = 0;

        campoDescuentoMovilidad.value = 0;

        campoTrabajador.value = 0;

        campoOtros.value = 0;


        gastoActual.textContent =
            dinero(0);

        gananciaActual.textContent =
            dinero(0);

        gananciaActual.style.color =
            "#10b981";


        colocarFechaActual();

    }
);


/* =========================================
   ELIMINAR
========================================= */

function eliminarShow(indice) {

    const show =
        shows[indice];


    if (!show) {
        return;
    }


    const confirmar =
        confirm(
            `¿Seguro que quieres eliminar "${show.nombre}"?`
        );


    if (!confirmar) {
        return;
    }


    shows.splice(
        indice,
        1
    );


    guardarDatos();

    mostrarShows();

}


/* =========================================
   RESUMEN
========================================= */

function actualizarResumen() {

    let ingresos = 0;

    let gastos = 0;

    let ganancia = 0;


    shows.forEach(show => {

        ingresos +=
            numero(show.precio);

        gastos +=
            numero(show.gastos);

        ganancia +=
            numero(show.ganancia);

    });


    totalIngresos.textContent =
        dinero(ingresos);


    totalGastos.textContent =
        dinero(gastos);


    totalGanancia.textContent =
        dinero(ganancia);


    totalShows.textContent =
        shows.length;


    if (ganancia < 0) {

        totalGanancia.style.color =
            "#ef4444";

    } else {

        totalGanancia.style.color =
            "#10b981";

    }

}


/* =========================================
   LIMPIAR TODO
========================================= */

document
    .getElementById("limpiarTodo")
    .addEventListener(
        "click",
        function() {

            if (shows.length === 0) {

                alert(
                    "No hay registros para eliminar."
                );

                return;

            }


            const confirmar =
                confirm(
                    "⚠️ ¿Seguro que quieres eliminar TODOS los shows?"
                );


            if (!confirmar) {
                return;
            }


            shows = [];


            guardarDatos();

            mostrarShows();

        }
    );


/* =========================================
   FECHA ACTUAL
========================================= */

function colocarFechaActual() {

    const hoy =
        new Date();


    const año =
        hoy.getFullYear();


    const mes =
        String(
            hoy.getMonth() + 1
        ).padStart(2, "0");


    const dia =
        String(
            hoy.getDate()
        ).padStart(2, "0");


    campoFecha.value =
        `${año}-${mes}-${dia}`;

}


/* =========================================
   INICIO
========================================= */

colocarFechaActual();

calcularFormulario();

mostrarShows();