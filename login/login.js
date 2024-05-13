window.addEventListener("load", principal, false);
window.addEventListener("load", cargarFlashMessage, false);

function principal() {
    document.getElementById("conectar").addEventListener('click', manejadorConectar);
}

function manejadorConectar() {
    if (validarCampos()) {
        var nombre = document.getElementById("nombre").value;
        var password = document.getElementById("password").value;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', './login.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                var respuesta = JSON.parse(xhr.responseText);
                if (respuesta) {
                    window.location.href = "../tienda/productos.html";
                } else {
                    setFlashMessage('Datos erroneos.', 'danger', true);
                }
            } else {
                setFlashMessage('Error.', 'danger', false);
            }
        };
        xhr.send("nombre=" + nombre + "&password=" + password);
    } else {
        setFlashMessage('Rellena los campos.', 'danger', false);
    }
}

function validarCampos() {
    ok = true;
    if (document.getElementById("nombre").value === "") {
        document.getElementById("nombre").style.borderColor = "red";
        ok = false;
    } else {
        document.getElementById("nombre").style.borderColor = "";
    }

    if (document.getElementById("password").value === "") {
        document.getElementById("password").style.borderColor = "red";
        ok = false;
    } else {
        document.getElementById("password").style.borderColor = "";
    }
    return ok;
}

function mostrarAlerta(mensaje, tiempo) {
    var alertBox = document.getElementById('customAlerta');
    var alertText = document.getElementById('alertaTexto');

    alertText.innerText = mensaje;
    alertBox.classList.remove('d-none');

    alertBox.classList.add('show');

    setTimeout(function () {
        alertBox.classList.add('d-none');
    }, tiempo);
}

function setFlashMessage(message, estado, recargar) {
    if (recargar) {
        localStorage.setItem('flash-' + estado, message);
        window.location.href = "";
    } else {
        mostrarFlashMessage(message, estado);
    }
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

function mostrarFlashMessage(message, estado) {
    var flashMessage = crearElemento('div', undefined, {
        id: 'flash-message', class: 'alert alert-' + estado + ' alert-dismissible fade show d-flex justify-content-center align-items-center', 
        style: 'position: fixed; top: 50%; left: 40%; transform: translate(-50%, -50%); z-index: 1050; min-width: 200px; padding: 20px;' });
    flashMessage.textContent = message;
    document.body.insertBefore(flashMessage, document.body.firstChild);

    setTimeout(function () {
        flashMessage.classList.add('d-none');
    }, 3000);
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