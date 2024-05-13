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

    resultado.forEach(reparacion => {
        var div = crearElemento("div", undefined, { class: 'col-md-3 mb-4' });
        var targeta = crearElemento("div", undefined, { class: 'card bg-secondary', style: 'height: 300px;' });
        targeta.innerHTML = `
        <div class="row no-gutters">
        <div class="col-md-8">
            <div class="card-body">
                <h5 class="card-title">${reparacion.motivo}</h5>
                <p class="card-text"><strong>Detalles:</strong> ${reparacion.mot_detalles}</p>
                <p class="card-text"><strong>Diagnóstico:</strong> ${reparacion.diagnostico}</p>
                <p class="card-text"><strong>Estado:</strong> ${reparacion.estado}</p>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card-body">
                    <p class="card-text"><strong>Tecnico:</strong> ${reparacion.empleado}</p>
                <p class="card-text"><strong>Fecha de recogida:</strong> ${reparacion.f_recepcion}</p>
                <p class="card-text"><strong>Coste:</strong> ${reparacion.coste}€</p>
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

function setFlashMessage(message, estado, recargar) {
    if (recargar) {
        localStorage.setItem('flash-' + estado, message);
        window.location.href = "./crud.html";
    } else {
        mostrarFlashMessage(message, estado);
    }
}

function mostrarFlashMessage(message, estado) {
    var contenido = document.getElementsByClassName('div-contenido')[0];
    var flashMessage = crearElemento('div', undefined, { id: 'flash-message', class: 'alert alert-' + estado + ' alert-dismissible fade show' });
    flashMessage.textContent = message;
    flashMessage.style.display = 'block';
    contenido.insertBefore(flashMessage, contenido.firstChild);

    setTimeout(function () {
        flashMessage.style.display = 'none';
    }, 3000);
}

function cargarFlashMessage() {
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key.startsWith("flash-")) {
            var message = localStorage.getItem(key);
            localStorage.removeItem(key);
            var estado = key.replace("flash-", "");
            mostrarFlashMessage(message, estado);
            i--;
        }
    }
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