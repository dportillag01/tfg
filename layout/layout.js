window.addEventListener("load", principal, false)

function principal() {
    //Comprobar si se ha iniciado sesion
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '../login/controlAcceso.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            var resultado = JSON.parse(xhr.responseText);
            crearHeader(resultado.login, resultado.admin);
        } else {
            setFlashMessage('Error al validar inicio de sesión.', 'danger', false);
        }
    };
    xhr.send();
}

function crearHeader(isLoged, isAdmin) {
    var nav = crearElemento('nav', undefined, { class: 'navbar navbar-expand-lg bg-dark px-5 mb-3' });
    var div1 = crearElemento('div', undefined, { id: 'layout', class: 'container-fluid' });

    var titulo = crearElemento('div', undefined, { id: 'titulo', class: 'me-5' });
    var h1 = crearElemento('h1', 'NOMBRE', { id: 'titulo', class: 'text-light' });
    titulo.appendChild(h1);
    div1.appendChild(titulo);

    var btn = crearElemento('button', undefined, { style: 'border-color: #212529; --bs-navbar-color: none; --bs-navbar-hover-color: none;', class: "navbar-toggler", type: "button", "data-bs-toggle": "collapse", "data-bs-target": "#navbarSupportedContent", "aria-controls": "navbarSupportedContent", "aria-expanded": "false", "aria-label": "Toggle navigation" });
    var a = crearElemento('img', undefined, { id: 'configUser', src: '../layout/imagenes/menu.png', style: 'height: 30px' });
    btn.appendChild(a);
    div1.appendChild(btn);

    var div = crearElemento('div', undefined, { id: 'navbarSupportedContent', class: 'collapse navbar-collapse' });
    div1.appendChild(div);

    var acciones = crearElemento('div', undefined, { id: 'titulo', class: 'my-2  navbar-collapse' });
    var accion1 = crearElemento('h5', 'Productos', { id: 'productos', class: 'text-light text-sm mx-3' });
    accion1.onclick = function () {
        window.location.href = "../tienda/productos.html";
    };
    acciones.appendChild(accion1);

    if (isLoged) {
        var accion2 = crearElemento('h5', 'Reparaciones', { id: 'reparaciones', class: 'text-light mx-3' });
        accion2.onclick = function () {
            window.location.href = "../tienda/reparaciones.html";
        };
        var accion3 = crearElemento('h5', 'Carrito', { id: 'carrito', class: 'text-light mx-3' });
        accion3.onclick = function () {
            window.location.href = "../tienda/carrito.html";
        };
        acciones.appendChild(accion2);
        acciones.appendChild(accion3);

        if (isAdmin) {
            var accion4 = crearElemento('h5', 'Gestión de Datos', { id: 'crud', class: 'text-light mx-3' });
            accion4.onclick = function () {
                window.location.href = "../administracion/crud.html";
            };
            acciones.appendChild(accion4);
        }
    }
    div.appendChild(acciones);

    /*var user = crearElemento('div', undefined, { id: 'titulo', class: 'my-2', style: 'display: flex' });
    var configUser = crearElemento('h5', 'Perfil', { id: 'perfil', class: 'text-light mx-3' });
    user.onclick = function () {
        window.location.href = "../administracion/crud.html";
    };
    user.appendChild(configUser);
    div.appendChild(user);*/

    nav.appendChild(div1);
    document.body.insertBefore(nav, document.body.firstChild);
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