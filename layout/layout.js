window.addEventListener("load", principal, false);

function principal() {
    var div = crearElemento('div', undefined, {id: 'layout', class: 'bg-secondary px-5 py-2', style: 'display: flex'});

    var titulo = crearElemento('div', undefined, {id: 'titulo'});
    var h1 = crearElemento('h1', 'NOMBRE', {id: 'titulo', class: 'text-'});

    var acciones = crearElemento('div', undefined, {id: 'titulo', class: 'mx-5 my-2', style: 'display: flex'});
    var accion1 = crearElemento('h4', 'Productos', {id: 'productos', class: 'text-light text-sm mx-3'});
    accion1.onclick = function () {
        window.location.href = "../tienda/productos.html";
    };
    var accion2 = crearElemento('h4', 'Reparaciones', {id: 'reparaciones', class: 'text-light mx-3'});
    accion2.onclick = function () {
        window.location.href = "../tienda/reparaciones.html";
    };
    var accion3 = crearElemento('h4', 'Carrito', {id: 'carrito', class: 'text-light mx-3'});
    accion3.onclick = function () {
        window.location.href = "../tienda/carrito.html";
    };
    var accion4 = crearElemento('h4', 'CRUD', {id: 'crud', class: 'text-light mx-3'});
    accion4.onclick = function () {
        window.location.href = "../administracion/crud.html";
    };

    titulo.appendChild(h1);
    div.appendChild(titulo);

    acciones.appendChild(accion1);
    acciones.appendChild(accion2);
    acciones.appendChild(accion3);
    acciones.appendChild(accion4);
    div.appendChild(acciones);

    document.body.insertBefore(div, document.body.firstChild);


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