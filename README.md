# IISSI2-IS: Simulacro de examen de laboratorio

## Preparación del entorno

Windows:

* Abra un terminal y ejecute el comando `npm run install:all:win`.

Linux/MacOS:

* Abra un terminal y ejecute el comando `npm run install:all:bash`.

## Ejecución y depuración

* Para **ejecutar el backend**, abra un terminal y ejecute el comando `npm run start:backend`.

* Para **ejecutar el frontend**, abra un nuevo terminal y ejecute el comando `npm run start:frontend`.

* Para **depurar el backend**, asegúrese de que **NO** existe una instancia en ejecución, pulse en el botón `Run and Debug` de la barra lateral, seleccione `Debug Backend` en la lista desplegable, y pulse el botón de *Play*.

* Para **depurar el frontend**, asegúrese de que **EXISTE** una instancia en ejecución, pulse en el botón `Run and Debug` de la barra lateral, seleccione `Debug Frontend` en la lista desplegable, y pulse el botón de *Play*.

---

## Enunciado

Una vez se ha puesto en marcha la primera versión de DeliverUS, los inversores han solicitado la inclusión de una nueva funcionalidad que consiste en ofrecer a los propietarios la posibilidad de promocionar sus restaurantes. Cada propietario sólo podrá promocionar uno de sus restaurantes.

Un propietario podrá promocionar un restaurante de dos maneras distintas:

* En el formulario de creación de restaurante. Por defecto, se seleccionará la opción de no promocionado. Si el propietario indica que el nuevo restaurante debe estar promocionado, pero ya existían restaurantes promocionados del mismo propietario, al pulsar el botón `Save` se mostrará un error y no se creará el restaurante.

* En la pantalla de "Mis restaurantes", mediante un botón mostrado junto a cada restaurante, que permitirá mediante su pulsación promocionar el restaurante en cuestión. Si el propietario pulsa el botón para promocionar un nuevo restaurante y ya existían otros restaurantes promocionados del mismo dueño, se procederá a promocionar el restaurante indicado y se marcará como "no promocionado" el restaurante que lo fuese anteriormente. La aplicación debe pedir confirmación al propietario cuando se pulse el botón; utilice para ello el componente suministrado `ConfirmationModal`, similar al componente `DeleteModal` utilizado en clase.

Además, los restaurantes promocionados aparecerán siempre al principio de los listados de restaurantes que se le presentan tanto a los propietarios como a los clientes. Además de presentarse al principio, los restaurantes promocionados deben destacarse visualmente, por lo que aparecerá una etiqueta de texto `¡En promoción!` con el color principal de la marca.

### Ejercicio 1

Realice todos los cambios necesarios en el proyecto de backend para implementar el nuevo requisito.

### Ejercicio 2

Realice todos los cambios necesarios en el proyecto de frontend para implementar el nuevo requisito.


![captura1](https://user-images.githubusercontent.com/19324988/235651836-d57d9c7e-4b8d-46a2-9154-b414a7abf702.png)


![captura2](https://user-images.githubusercontent.com/19324988/235651849-4d03c7d9-f332-4952-8cbc-9fa5db4f97fb.png)


![captura3](https://user-images.githubusercontent.com/19324988/235651853-e1d13916-4f47-4e17-97e0-5696b647bee7.png)
"# DeliverUS-Owner" 
