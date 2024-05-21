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
    xhrProductos.send('accion=obtenerCarrito');
}

function crearTarjetas(resultado) {
    var grid = crearElemento('div', undefined, { id: 'grid', class: 'row mx-5' });
    var h1 = crearElemento('h1', 'Carrito:', { class: 'bg-dark border border-dark rounded mx-5 px-1', style: 'color: #8576FF; display: inline-block;' });
    document.body.appendChild(h1);
    if (resultado.length == 0) {
        var vacio = crearElemento('h3', 'No hay reparaciones.', { class: 'bg-light p-2 rounded', style: 'width: 300px' });
        grid.appendChild(vacio);
    }
    resultado.forEach(producto => {
        var rep = crearElemento("div", undefined, { class: 'col-xl-12 col-xxl-6 mb-4' });
        var targeta = crearElemento("div", undefined, { class: 'card h-100 bg-dark text-white'});
        targeta.innerHTML = `
            <div class="row no-gutters">
                <div class="col-md-2 fix-size p-3">
                    <img src="./imagenes/producto${producto.fk_producto}.jpg" class="card-img">
                </div>
                <div class="col-md-4">
                    <div class="card-body">
                        <h5 class="card-title" style="color: #8576FF">${producto.nombre}</h5>
                        <!--<p class="card-text">Fecha de entrega: ${producto.f_entrega}</p>-->
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card-body">
                        <p class="card-text">Cantidad x${producto.cantidad}<strong></strong></p>
                        <p class="card-text">Precio por unidad: ${producto.precio}€<strong></strong></p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card-body">
                        <a href="./carrito.html" class="btn btn-danger">Eliminar</a>
                        <!--<a href="./carrito.html" class="btn btn-primary">Modificar</a>-->
                    </div>
                </div>
            </div>
        `;
        rep.appendChild(targeta);
        grid.appendChild(rep);
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