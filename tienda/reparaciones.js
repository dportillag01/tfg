window.addEventListener("load", principal, false);
window.addEventListener("load", cargarFlashMessage, false);

function principal() {
    var xhrProductos = createXMLHttpRequest();
    xhrProductos.onload = function () {
        if (xhrProductos.status >= 200 && xhrProductos.status < 300) {
            var resultado = JSON.parse(xhrProductos.responseText);
            crearTarjetas(resultado);
        } else {
            setFlashMessage('Error al obtener los productos.', 'danger', false);
        }
    };
    xhrProductos.send('accion=obtenerReparaciones');
}

function crearTarjetas(resultado) {
    var grid = crearElemento('div', undefined, { id: 'grid', class: 'row mx-5' });
    if (resultado.length == 0) {
        var vacio = crearElemento('h3', 'No hay reparaciones.', { class: 'bg-light p-2 rounded', style: 'width: 300px' });
        grid.appendChild(vacio);
    }
    resultado.forEach(reparacion => {
        var div = crearElemento("div", undefined, { class: 'col-sm-12 col-lg-6 mb-4' });
        var targeta = crearElemento("div", undefined, { class: 'card h-100 bg-light' });
        targeta.innerHTML = `
        <div class="row no-gutters">
            <h5 class="card-title mt-3 mx-3" style="color: #8576FF"><strong>${reparacion.motivo}</strong></h5>
            <div class="col-md-8">
                <div class="card-body">
                    <p class="card-text"><strong>Detalles:</strong> ${reparacion.mot_detalles}</p>
                    <p class="card-text"><strong>Diagnóstico:</strong> ${reparacion.diagnostico}</p>
                    <p class="card-text"><strong>Estado: ${reparacion.estado ? '<span style="color: #13BF56">Completado</span>' : '<span class="text-warning">En proceso</span>'}</strong></p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card-body">
                    <p class="card-text"><strong>Tecnico:</strong> ${reparacion.empleado}</p>
                    <p class="card-text"><strong>Fecha de recogida:</strong> ${reparacion.f_recepcion}</p>
                    <p class="card-text"><strong>Coste:</strong> ${reparacion.coste}€</p>
                </div>
            </div>
        </div>
        `;
        div.appendChild(targeta);
        grid.appendChild(div);
    });
    document.body.appendChild(grid);
}

function createXMLHttpRequest() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', './consultas.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    return xhr;
}

function crearElemento(etiqueta, texto, atributos) {
    let elementoNuevo = document.createElement(etiqueta);
    if (texto !== undefined) {
        let contenido = document.createTextNode(texto);
        elementoNuevo.appendChild(contenido);
    }
    if (atributos !== undefined) {
        for (let clave in atributos) {
            elementoNuevo.setAttribute(clave, atributos[clave]);
        }
    }
    return elementoNuevo;
}