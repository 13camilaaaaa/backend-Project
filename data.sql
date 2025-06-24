create user "project"@"localhost" identified by "fullstack2025";
create database project_prototype;
grant all privileges on project_prototype.* to "project"@"localhost";
flush privileges;


use project_prototype;

-- *** FASE 3: DISEÑO FÍSICO (IMPLEMENTACIÓN SQL con tabla 'direcciones') ***

-- 1. Tabla tipos_identificacion (ya existente)
CREATE TABLE tipos_identificacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Nueva Tabla: tipos_via (necesaria antes de direcciones)
CREATE TABLE tipos_via (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo_via VARCHAR(50) NOT NULL UNIQUE
);

-- 3. Nueva Tabla: direcciones (necesaria antes de usuarios)
CREATE TABLE direcciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_tipo_via INT NOT NULL, -- FK a tipos_via
    numero_via VARCHAR(40) NOT NULL, -- Ej: #16-09
    complemento VARCHAR(100), -- Ej: Apto 301, Interior 2 (opcional)
    barrio VARCHAR(100),
    ciudad VARCHAR(100) NOT NULL,
    -- Puedes añadir más campos de dirección aquí si los necesitas:
    -- codigo_postal VARCHAR(10),
    -- id_departamento INT, -- FK a tabla de departamentos
    -- id_pais INT,       -- FK a tabla de paises
    FOREIGN KEY (id_tipo_via) REFERENCES tipos_via(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 4. Tabla USUARIOS (Ajustada para usar la nueva tabla de direcciones)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_identificacion VARCHAR(50) NOT NULL UNIQUE,
    id_tipo_identificacion INT NOT NULL,
    nombre_usuario VARCHAR(50) NOT NULL,
    apellido_usuario VARCHAR(50),
    contrasena VARCHAR(100) NOT NULL,
    correo_usuario VARCHAR(100) UNIQUE NOT NULL,
    telefono_usuario VARCHAR(20),
    id_direccion INT NULL, -- FK a la tabla de direcciones (puede ser NULL si la dirección es opcional)
    fecha_registro DATETIME DEFAULT NOW(),
    FOREIGN KEY (id_tipo_identificacion) REFERENCES tipos_identificacion(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_direccion) REFERENCES direcciones(id) ON DELETE SET NULL ON UPDATE CASCADE -- SET NULL si la dirección es opcional
);

-- 3. Tabla ROLES
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

-- 4. Tabla intermedia usuario_rol
CREATE TABLE usuario_rol (
    id_usuario INT NOT NULL, -- Referencia al nuevo ID interno de usuarios
    id_rol INT NOT NULL,
    PRIMARY KEY (id_usuario, id_rol),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE, -- Referencia a usuarios.id
    FOREIGN KEY (id_rol) REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 5. Tablas de Catálogo para PRODUCTOS (Tallas, Categorias, Generos, Colores)
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL UNIQUE
);
CREATE TABLE tallas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_talla VARCHAR(50) NOT NULL UNIQUE
);
CREATE TABLE generos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_genero VARCHAR(50) NOT NULL UNIQUE
);
CREATE TABLE colores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_color VARCHAR(50) NOT NULL UNIQUE
);

-- 6. Tabla PRODUCTOS
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    imagen VARCHAR(255),
    fecha_ingreso DATETIME DEFAULT NOW(),
    ultima_actualizacion DATETIME DEFAULT NOW() ON UPDATE NOW(),
    id_talla INT NOT NULL,
    id_genero INT NOT NULL,
    id_categoria INT NOT NULL,
    id_color INT NOT NULL,
    FOREIGN KEY (id_talla) REFERENCES tallas(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_genero) REFERENCES generos(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_color) REFERENCES colores(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 7. Tabla VENTAS
CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT, -- FK a usuarios (puede ser NULL si es un pedido de invitado)
    fecha DATETIME DEFAULT NOW(), -- Fecha de creación del pedido
    total DECIMAL(10, 2) NOT NULL, -- Total del pedido
    
    -- ESTO ES CLAVE para tu flujo de pago en entrega:
    estado_pedido VARCHAR(50) NOT NULL DEFAULT 'Pendiente', -- Ej: 'Pendiente', 'Confirmado', 'Enviado', 'Entregado', 'Entregado y Pagado', 'Cancelado'
    
    -- Información de entrega y pago
    id_direccion_envio INT, -- FK a la dirección de envío específica para este pedido
    metodo_pago VARCHAR(50), -- Ej: 'Contra Entrega Efectivo', 'Contra Entrega Tarjeta', 'Online Tarjeta'
    transaccion_id_pago VARCHAR(255) UNIQUE, -- ID de transacción si hay un pago online o referencia de pago
    fecha_pago DATETIME, -- Nuevo: Fecha y hora exacta en que se confirmó el pago (ej. al entregar)
    
    comentarios TEXT, -- Notas o comentarios del pedido

    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_direccion_envio) REFERENCES direcciones(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tu tabla detalle_venta se mantiene igual, ya que describe los productos en CADA 'venta'/'pedido'
CREATE TABLE detalle_venta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL, -- Ahora se refiere al ID del pedido en la tabla 'ventas'
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    talla_seleccionada VARCHAR(50),
    color_seleccionado VARCHAR(50),
    UNIQUE (venta_id, producto_id),
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT ON UPDATE CASCADE
);