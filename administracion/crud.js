window.addEventListener("load", principal, false);
window.addEventListener("load", cargarFlashMessage, false);

function principal() {
    var h1 = crearElemento('h1', formatNombre(tablaSelect()), { class: 'text-white' });
    h1.innerHTML += '&nbsp;';
    var contenido = document.getElementsByClassName('titulo')[0];
    contenido.insertBefore(h1, contenido.firstChild);

    var xhrTabla = createXMLHttpRequest();
    xhrTabla.onload = function () {
        if (xhrTabla.status >= 200 && xhrTabla.status < 300) {
            var resultado = JSON.parse(xhrTabla.responseText);
            crearSelect(resultado);
        } else {
            setFlashMessage('Error al obtener las tablas.', 'danger', false);
        }
    };
    xhrTabla.send('accion=obtenerTablas');

    var xhrEstructura = createXMLHttpRequest();
    xhrEstructura.onload = function () {
        if (xhrEstructura.status >= 200 && xhrEstructura.status < 300) {
            var estructura = JSON.parse(xhrEstructura.responseText);
            crearFormRegistro(estructura);

            var xhrRegistros = createXMLHttpRequest();
            xhrRegistros.onload = function () {
                if (xhrRegistros.status >= 200 && xhrRegistros.status < 300) {
                    var registros = JSON.parse(xhrRegistros.responseText);
                    crearTablaRegistros(estructura, registros);
                } else {
                    setFlashMessage('Error al obtener los registros.', 'danger', false);
                }
            };
            xhrRegistros.send('accion=obtenerRegistros&tabla=' + encodeURIComponent(tablaSelect()));
        } else {
            setFlashMessage('Error al obtener la tabla.', 'danger', false);
        }
    };
    xhrEstructura.send('accion=obtenerEstructuraTabla&tabla=' + encodeURIComponent(tablaSelect()));
}

function crearSelect(tablas) {
    var select = crearElemento('select', undefined, { name: 'tabla', id: 'tabla', class: 'form-select form-select-lg' });
    var optDefault = crearElemento('option', 'Selecciona una tabla', { value: '', disabled: true, selected: true, hidden: true });
    select.appendChild(optDefault);
    tablas.forEach(function (tabla) {
        var option = crearElemento('option', formatNombre(tabla.Tables_in_informtienda), { value: tabla.Tables_in_informtienda });
        select.appendChild(option);
    });

    select.onchange = function () {
        localStorage.setItem('tablaSeleccionada', document.getElementById('tabla').value);
        window.location.href = "./crud.html";
    };

    document.getElementsByClassName('titulo')[0].appendChild(select);
}

function crearFormRegistro(estructura) {
    var form = document.getElementById('formRegistro');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        var formData = new FormData(form);
        formData.append('tabla', tablaSelect());

        var data = "";
        for (var pair of formData.entries()) {
            data += pair[0] + '=' + encodeURIComponent(pair[1]) + '&';
        }
        data += 'accion=insertarRegistro';

        var xhrNewRegistro = createXMLHttpRequest();

        xhrNewRegistro.onload = function () {
            if (xhrNewRegistro.status >= 200 && xhrNewRegistro.status < 300) {
                setFlashMessage('Registro editado exitosamente.', 'success', true);
            } else {
                setFlashMessage(JSON.parse(xhrNewRegistro.responseText), 'danger', false);
            }
        };
        xhrNewRegistro.onerror = function () {
            setFlashMessage('Error de red al intentar enviar la solicitud.', 'danger', false);
        };
        xhrNewRegistro.send(data);
    });

    estructura.forEach(function (campo) {
        formGenerico(campo, "", form);
    });

    var btn = crearElemento('button', 'Insertar', { type: 'submit', name: 'insertar', class: 'btn btn-primary' });
    form.appendChild(btn);
}

function crearTablaRegistros(estructura, registros) {
    var contenido = document.getElementsByClassName('div-contenido')[0];

    var table = crearElemento('table', undefined, { id: 'registros', class: 'table table-responsive table-striped border border-2 border-dark rounded' });
    var thead = crearElemento('thead', undefined, { class: 'table-dark' });
    var tr = crearElemento('tr');

    estructura.forEach(function (campo) {
        if (campo[0] !== 'Id' || tablaSelect() == "pedidos") {
            var th = crearElemento('th', formatNombre(campo[0]));
            tr.appendChild(th);
        }
    });

    var thAcciones = crearElemento('th', '');
    tr.appendChild(thAcciones.cloneNode(true));
    tr.appendChild(thAcciones.cloneNode(true));
    thead.appendChild(tr);
    table.appendChild(thead);

    var tBody = crearElemento('tbody');
    registros.forEach(function (registro, index) {
        var trRegistro = crearElemento('tr', undefined, { id: "tr" + (index + 1) });

        estructura.forEach(function (campo, cIndex) {
            if (campo[0].startsWith("Fk_")) {
                var xhrFk = createXMLHttpRequest();
                xhrFk.onload = function () {
                    if (xhrFk.status >= 200 && xhrFk.status < 300) {
                        var resultado = JSON.parse(xhrFk.responseText);
                        var clave = Object.keys(resultado[0]);

                        resultado.forEach(function (r) {
                            var tdCampo = crearElemento('td', r[clave[1]], { id: "td" + (index + 1) + "." + (cIndex + 1) });
                            trRegistro.appendChild(tdCampo);
                            posicionarTabla(trRegistro);
                        });
                    } else {
                        console.error('Error al obtener las tablas.');
                    }
                };
                xhrFk.send('accion=obtenerFK&tabla=' + encodeURIComponent(campo[0].substring(3)) + '&id=' + encodeURIComponent(registro[campo[0]]));
            } else if (campo[0] !== 'Id' || tablaSelect() == "pedidos") {
                if (campo[1] === 'tinyint' && registro[campo[0]] == 1) {
                    registro[campo[0]] = 'Completado';
                } else if (campo[1] === 'tinyint' && registro[campo[0]] == 0) {
                    registro[campo[0]] = 'En proceso';
                } else if (registro[campo[0]] == null) {
                    registro[campo[0]] = '';
                }
                var tdCampo = crearElemento('td', registro[campo[0]], { id: "td" + (index + 1) + "." + (cIndex + 1) });
                trRegistro.appendChild(tdCampo);
            }
        });

        var tdEditar = crearElemento('td', undefined, { id: 'td' + (index + 1) + '.98', class: 'text-end col-auto px-0' });
        var btnEditar = crearElemento('button', 'Editar', { type: 'button', 'data-toggle': 'modal', 'data-target': '#modalEditar', "class": "btn btn-primary" });
        btnEditar.addEventListener('click', function () {
            modificarRegistro(registro);
        });
        tdEditar.appendChild(btnEditar);

        var tdEliminar = crearElemento('td', undefined, { id: 'td' + (index + 1) + '.99', class: 'text-end col-auto ps-0 pe-2' });
        var btnEliminar = crearElemento('button', 'Borrar', { type: 'button', 'data-toggle': 'modal', 'data-target': '#modalEliminar', "class": "btn btn-danger" });
        btnEliminar.addEventListener('click', function () {
            document.getElementsByClassName('modal-title')[2].innerHTML = 'Eliminar: ' + registro[obtenerParametroSecundario(tablaSelect())];
            document.getElementById('btnEliminar').addEventListener('click', function () {
                eliminarRegistro(registro);
            });
        });
        tdEliminar.appendChild(btnEliminar);

        trRegistro.appendChild(tdEditar);
        trRegistro.appendChild(tdEliminar);

        tBody.appendChild(trRegistro);
    });
    table.appendChild(tBody);
    contenido.appendChild(table);

}

function modificarRegistro(registro) {
    var xhrEstructuraEditar = createXMLHttpRequest();
    xhrEstructuraEditar.onload = function () {
        if (xhrEstructuraEditar.status >= 200 && xhrEstructuraEditar.status < 300) {
            var estructura = JSON.parse(xhrEstructuraEditar.responseText);
            var xhrRegistro = createXMLHttpRequest();
            xhrRegistro.onload = function () {
                if (xhrRegistro.status >= 200 && xhrRegistro.status < 300) {
                    var registro = JSON.parse(xhrRegistro.responseText);
                    crearFormEditar(registro, estructura);
                } else {
                    setFlashMessage('Error al obtener los registros.', 'danger', false);
                }
            };
            xhrRegistro.send('accion=obtenerRegistro&tabla=' + encodeURIComponent(tablaSelect()) + '&id=' + encodeURIComponent(registro['id']));
        } else {
            setFlashMessage('Error al obtener la tabla.', 'danger', false);
        }
    };
    xhrEstructuraEditar.send('accion=obtenerEstructuraTabla&tabla=' + encodeURIComponent(tablaSelect()));
}

function crearFormEditar(registro, estructura) {
    document.getElementsByClassName('modal-title')[1].innerHTML = 'Editar: ' + registro[0][obtenerParametroSecundario(tablaSelect())];
    var form = document.getElementById('formEditar');
    form.innerHTML = '';

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        var formData = new FormData(form);
        formData.append('tabla', tablaSelect());
        formData.append('id', registro[0]['id']);

        var data = "";
        for (var pair of formData.entries()) {
            data += pair[0] + '=' + encodeURIComponent(pair[1]) + '&';
        }
        data += 'accion=actualizarRegistro';

        var xhrEditRegistro = createXMLHttpRequest();
        xhrEditRegistro.onload = function () {
            if (xhrEditRegistro.status >= 200 && xhrEditRegistro.status < 300) {
                setFlashMessage('Registro editado exitosamente.', 'success', true);
            } else {
                setFlashMessage(JSON.parse(xhrEditRegistro.responseText), 'danger', false);
            }
        };
        xhrEditRegistro.onerror = function () {
            setFlashMessage('Error de red al intentar enviar la solicitud.', 'danger', false);
        };
        xhrEditRegistro.send(data);
    });

    Object.keys(registro[0]).forEach(function (campo, index) {
        formGenerico(estructura[index], registro[0][campo], form);
    });

    var btn = crearElemento('button', 'Insertar', { type: 'submit', name: 'insertar', class: 'btn btn-primary' });
    form.appendChild(btn);
}

function eliminarRegistro(registro) {
    var xhrSuprRegistro = createXMLHttpRequest();
    xhrSuprRegistro.onload = function () {
        if (xhrSuprRegistro.status >= 200 && xhrSuprRegistro.status < 300) {
            setFlashMessage('Registro eliminado exitosamente.', 'success', true);
        } else {
            setFlashMessage(JSON.parse(xhrSuprRegistro.responseText), 'danger', false);
        }
    };
    xhrSuprRegistro.onerror = function () {
        setFlashMessage('Error de red al intentar enviar la solicitud.', 'danger', false);
    };
    xhrSuprRegistro.send('accion=eliminarRegistro&tabla=' + encodeURIComponent(tablaSelect()) + '&id=' + encodeURIComponent(registro['id']));

    document.getElementById('modalEliminar').style.display = 'none';
    var backdrop = document.querySelector('.modal-backdrop');
    backdrop.parentNode.removeChild(backdrop);
}

function tablaSelect() {
    var tablaSeleccionada = localStorage.getItem('tablaSeleccionada');
    if (tablaSeleccionada === null || tablaSeleccionada === undefined) {
        tablaSeleccionada = 'productos';
    }
    return tablaSeleccionada;
}

function createXMLHttpRequest() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', './crud.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    return xhr;
}

function formGenerico(campo, registro, form) {
    if (campo[0] !== 'id') {
        var label = crearElemento('label', formatNombre(campo[0]), { 'for': campo[0] });
        var div = crearElemento('div', undefined, { class: 'form-floating' });
        var input;

        if (campo[0].startsWith("fk_")) {
            var xhrFk = createXMLHttpRequest();
            xhrFk.onload = function () {
                if (xhrFk.status >= 200 && xhrFk.status < 300) {
                    var resultado = JSON.parse(xhrFk.responseText);
                    input = crearElemento('select', undefined, { name: campo[0], id: campo[0], class: 'form-select' });
                    var clave = Object.keys(resultado[0]);

                    resultado.forEach(function (r) {
                        var option = crearElemento('option', r[clave[1]], { value: r[clave[0]] });
                        if (registro == r.id) {
                            option.setAttribute('selected', 'selected');
                        }
                        input.appendChild(option);
                    });
                    form.insertBefore(crearElemento('br'), form.firstChild);
                    div.appendChild(input);
                    div.appendChild(label);
                    form.insertBefore(div, form.firstChild);

                } else {
                    console.error('Error al obtener las tablas.');
                }
            };
            xhrFk.send('accion=obtenerFK&tabla=' + encodeURIComponent(campo[0].substring(3)) + '&id=' + encodeURIComponent("0"));

        } else if (campo[0] === 'Observaciones') {
            input = crearElemento('textarea', registro, { name: campo[0], id: campo[0], placeholder: formatNombre(campo[0]), class: 'form-control' });
        } else if (campo[1] === 'tinyint') {
            input = crearElemento('input', undefined, { name: campo[0], id: campo[0], value: 1, class: 'btn-check', type: 'radio' });
            var inputNo = crearElemento('input', undefined, { name: campo[0], id: 'no-' + campo[0], value: 0, class: 'btn-check', type: 'radio' });
            registro === 1 ? input.checked = true : inputNo.checked = true;
        } else if (campo[1] === 'date') {
            input = crearElemento('input', undefined, { name: campo[0], id: campo[0], value: registro, class: 'form-control', type: 'date' });
        } else if (campo[1] === 'int') {
            input = crearElemento('input', undefined, { name: campo[0], id: campo[0], value: registro, placeholder: formatNombre(campo[0]), class: 'form-control', type: 'number', maxlength: '10' });
        } else if (campo[0] === 'Email') {
            input = crearElemento('input', undefined, { name: campo[0], id: campo[0], value: registro, placeholder: formatNombre(campo[0]), class: 'form-control', type: 'email', maxlength: campo[2] });
        } else if (campo[1] === 'varchar') {
            input = crearElemento('input', undefined, { name: campo[0], id: campo[0], value: registro, placeholder: formatNombre(campo[0]), class: 'form-control', type: 'text', maxlength: campo[2] });
        } else {
            input = crearElemento('input', undefined, { name: campo[0], id: campo[0], value: registro, placeholder: formatNombre(campo[0]), class: 'form-control', type: 'text' });
        }

        if (campo[1] === 'tinyint') {
            div = crearElemento('div');
            label = crearElemento('label', 'Completado', { 'for': campo[0], class: 'btn btn-outline-success checkFix' });
            var labelNo = crearElemento('label', 'En progreso', { 'for': 'no-' + campo[0], class: 'btn btn-outline-danger checkFix' });

            label.addEventListener('click', function () {
                input.checked = true;
            });

            labelNo.addEventListener('click', function () {
                inputNo.checked = true;
            });

            div.appendChild(input);
            div.appendChild(label);
            div.appendChild(inputNo);
            div.appendChild(labelNo);
            form.appendChild(div);
            form.appendChild(crearElemento('br'));
        } else if (!campo[0].startsWith("fk_")) {
            div.appendChild(input);
            div.appendChild(label);
            form.appendChild(div);
            form.appendChild(crearElemento('br'));
        }
    }
}

function posicionarTabla(tr) {
    var tds = tr.getElementsByTagName('td');
    var tdsArray = Array.prototype.slice.call(tds);

    tdsArray.sort(function (a, b) {
        var idA = parseInt(a.id.split('.')[1]);
        var idB = parseInt(b.id.split('.')[1]);
        return idA - idB;
    });

    tdsArray.forEach(function (td) {
        tr.appendChild(td);
    });
}

function formatNombre(nombre) {
    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

function obtenerParametroSecundario($tabla) {
    if ($tabla == 'ventas') {
        return 'id';
    } else {
        return 'nombre';
    }
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