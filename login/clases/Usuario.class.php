
<?php
    
    class Usuario{

        public $id;
        public $admin;
        public $nombre;
        public $email;
        public $telefono;
        public $password;
        public $activo;
        public $observaciones;

        
        function __construct($id, $admin, $nombre, $email, $telefono, $password, $activo, $observaciones){
            $this->id = $id;
            $this->admin = $admin;
            $this->nombre = $nombre;
            $this->email = $email;
            $this->telefono = $telefono;
            $this->password = $password;
            $this->activo = $activo;
            $this->observaciones = $observaciones;
        }
    }

?>