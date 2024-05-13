

class Empleado{

    constructor(id, dni, nombre, email, telefono, password, apellidos, direccion){
        this._id = id;
        this._dni = dni;
        this._nombre = nombre;
        this._email = email;
        this._telefono = telefono;
        this._password = password;
        this._apellidos = apellidos;
        this._direccion = direccion;
    }

    set id(idnuevo){this._id = idnuevo;}
    set dni(valor){this._dni = valor;}
    set nombre(nombreNuevo){this._nombre = nombreNuevo;}
    set email(emailNuevo){this._email = emailNuevo;}
    set telefono(telefonoNuevo){this._telefono = telefonoNuevo;}
    set password(passwordNuevo){this._password = passwordNuevo;}
    set apellidos(valor){this._apellidos = valor;}
    set direccion(direccionNuevas){this._direccion = direccionNuevas;}

    get id(){return this._id;}
    get dni(){return this._dni;}
    get nombre(){return this._nombre;}
    get email(){return this._email;}
    get telefono(){return this._telefono;}
    get password(){return this._password;}
    get apellidos(){return this._apellidos;}
    get direccion(){return this._direccion;}

    toString() {
        return "id: ${this._id}, dni: ${this._dni}, nombre: ${this._nombre}, email: ${this._email}, telefono: ${this._telefono}, apellidos: ${this._apellidos}, direccion: ${this._direccion}";
    }
}