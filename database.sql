create database if not exists productosRegionalesDB character set utf8mb4;
use productosRegionalesDB;

create table usuario(
id_usuario int primary key auto_increment,
nombre_user varchar(50) not null,
correo varchar(50) not null,
contraseña varchar(50) not null,
rol varchar(50) not null,
estado varchar(50) default 'activo'
);

create table cliente(
id_cliente int primary key auto_increment,
nombre varchar(50) not null,
apellido varchar(50) not null,
dni varchar(8) not null ,
telefono varchar(9) not null,
direccion varchar(255) not null,
correo varchar(255) not null
);

create table producto(
id_producto int primary key auto_increment,
nombre_producto varchar(150) not null,
categoria enum("cafe","cacao","miel") not null, 
region_origen varchar(50) not null,
precio decimal(10,2) not null,
stock int,
descripcion text
);

create table pedido (
id_pedido INT AUTO_INCREMENT PRIMARY KEY,
id_cliente INT NOT NULL,
id_producto INT NOT NULL,
fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
cantidad INT NOT NULL,
total DECIMAL(10, 2) NOT NULL,
estado_pedido VARCHAR(20) DEFAULT 'pendiente',
CONSTRAINT fk_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
CONSTRAINT fk_producto FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);
