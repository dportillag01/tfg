window.addEventListener("load", principal, false);
window.addEventListener("load", cargarFlashMessage, false);

function principal() {
    var urlParams = new URLSearchParams(window.location.search);
    var xhrProductos = createXMLHttpRequest();
    xhrProductos.onload = function () {
        if (xhrProductos.status >= 200 && xhrProductos.status < 300) {
            var resultado = JSON.parse(xhrProductos.responseText);
            if (urlParams.has('id')) {
                crearDetalle(resultado[0]);
            } else {
                crearTarjetas(resultado);
            }
        } else {
            setFlashMessage('Error al obtener los productos.', 'danger', false);
        }
    };
    if (urlParams.has('id')) {
        xhrProductos.send('accion=obtenerProducto&id=' + urlParams.get('id'));
    } else {
        xhrProductos.send('accion=obtenerProductos');
    }
}

function crearTarjetas(resultado) {
    var grid = crearElemento('div', undefined, { id: 'grid', class: 'row mx-5' });

    resultado.forEach(producto => {
        var div = crearElemento("div", undefined, { class: 'col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-4', style: 'cursor: pointer;' });
        var targeta = crearElemento("div", undefined, { class: 'card h-100' });
        targeta.innerHTML = `
            <img src="./imagenes/producto${producto.id}.jpg" class="card-img-top" style="object-fit: cover; height: 240px">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <h6 class="card-text" style="color: #8576FF">${producto.precio}€</h6>
                    <p class="card-text">${producto.descripcion}</p>
                </div>
            </div>
        `;
        targeta.onclick = function () {
            window.location.href = '?id=' + producto.id;
        }
        div.appendChild(targeta);
        grid.appendChild(div);
    });
    document.body.appendChild(grid);
}

function crearDetalle(resultado) {
    var div = crearElemento('div', undefined, { class: 'p-3 detalle' });
    var h1 = crearElemento('h1', resultado['producto.nombre'], { class: 'bg-dark border border-dark rounded px-1', style: 'color: #8576FF; display: inline-block;' });
    div.appendChild(h1);

    var grid = crearElemento('div', undefined, { id: 'grid', class: 'row'});

    var dcha = crearElemento('div', undefined, { class: 'col-md-12 col-lg-6 mb-2' });
    var img = crearElemento('img', undefined, { src: './imagenes/producto' + resultado["producto.id"] + '.jpg', class: 'img-detalle' });
    dcha.appendChild(img);

    var izq = crearElemento("div", undefined, { class: 'col-md-12 col-lg-6 bg-dark rounded p-3 mb-2 text-white' });
    izq.innerHTML = `
    <h4 style="color: #8576FF"><strong>${resultado['producto.precio']}€</strong></h4>
    <p>${resultado['producto.descripcion']}</p>
    <p class="m-0"><strong>Proveedor: ${resultado['proveedor.nombre']} </strong></p>
    <p class="border border-white rounded p-3">
        <strong>Teléfono/s:</strong><br>${resultado['telefonos.proveedor'].replace(/,/g, '<br>')}<br>
        <strong>Email:</strong> ${resultado['proveedor.email']}
    </p>
    `;
    var form = crearElemento('form', undefined, { id: 'añadirCarrito'});
    form.innerHTML = `
    <div class="form-group d-flex align-items-center">
        <label for="cantidad" class="mr-2">Cantidad:&nbsp;</label>
        <div class="input-group flex-grow-1">
            <input type="number" id="cantidad" name="cantidad" class="form-control input-number" value="1" min="1" max="99">
        </div>
    </div>
    <button type="submit" class="btn btn-light mt-2">Solicitar Producto</button>
    `;
    izq.appendChild(form);

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        var xhr = createXMLHttpRequest();
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                setFlashMessage('Producto añadido al carrito.', 'primary', true);
            } else {
                setFlashMessage('Error al añadir el producto al carrito.', 'danger', false);
            }
        };
        xhr.send('accion=añadirCarrito&id=' + resultado['producto.id'] + '&cantidad=' + document.getElementById('cantidad').value);
    });

    grid.appendChild(dcha);
    grid.appendChild(izq);

    div.appendChild(grid);
    document.body.appendChild(div);
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