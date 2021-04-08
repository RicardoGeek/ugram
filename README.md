# ugram
Aplicación para el almacenamiento de fotos

# Seminario de sistemas 1
- Practica 1 de laboratorio
- Pareja #62

# Manual de Configuraciones

## Load Balancer

Se crearon 2 instancias de AWS EC2 de capa gratuita, uno para el backend nodejs y otro para el backend python.

![instancias](https://github.com/RicardoGeek/ugram/blob/main/docs/ec2.PNG)

Luego de haber creado las instancias creamos un load balancer y agregamos esas instancias como targes escuchando al puerto 80

![LB](https://github.com/RicardoGeek/ugram/blob/main/docs/lb1.PNG)

![LB](https://github.com/RicardoGeek/ugram/blob/main/docs/lb2.PNG)

![LB](https://github.com/RicardoGeek/ugram/blob/main/docs/lb3.PNG)

## Frontend en S3

Luego configuramos un bucket que esta capacitado para servir archivos estaticos como un wen server.

Y creamos una app en angular para que el frontend fuera elegante y funcional.

![LB](https://github.com/RicardoGeek/ugram/blob/main/docs/s31.PNG)

![LB](https://github.com/RicardoGeek/ugram/blob/main/docs/s32.PNG)

## Configuracion backend pyhton

1. Instalar nginx 
    
    ```yum install -y nginx```

2. Crear un revers proxy para que escuche el puerto de flask a traves del puerto 80

```
location / {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

3. Crear un servicio para que la app flask corra en systemctl

```
[Unit]
Description=upgram app
After=network.target

[Service]
User=ec2-user
WorkingDirectory=/home/ec2-user/ugram/Web/python
ExecStart=/home/ec2-user/ugram/Web/python/venv/bin/gunicorn -b localhost:5000 -$
Restart=always

[Install]
WantedBy=multi-user.target
```
Luego actualizar el daemon e iniciar el servicio

```sudo systemctl dameon-reload```

```sudo systemctl start ugram```

4. Credenciales AWS
En el path ```~/.aws/credentials``` cofiguramos las llaves de aws para el usuario que tiene acceso a S3 y a dynamo que creamos para los backends, este paso es similar a el backend en node.


## Configuracion Backend node
```
sudo apt-get install nodejs  --> Instalar node
sudo npm install -g pm2 --> Administrador de procesos para nodejs

git clone repositorio
npm install

pm2 start index.js   --> Iniciar el servidor node
pm2 stop index.js  --> Parar el servidor node
pm2 restart index.js  --> Reiniciar el servidor node
```

Arranca el servidor en puerto 3000

Luego de forma similar configurar el nginx y el daemon

## Usuarios

se crearon diferentes usuarios para poder acceder a los diferentes servicios de Aws tanto en administracion como en comunicacion de backends.

![users](https://github.com/RicardoGeek/ugram/blob/main/docs/users1.PNG)

## Amazon Rekognition

Se agregaron feature de inteligencia artificial para el tratamiento de imagenes y autenticacion por rostro.

![users](https://github.com/RicardoGeek/ugram/blob/main/docs/photo-auth.PNG)

Para esto se utlizio el face comparsion de Rekognition

Ademas se agregaron etiquetas a las imagenes y los albunes ahora son dinamicamente generados por esas etiquetas

## Chat

Se configuraron 3 opciones de chat en amazon Lex para reconocer los intents.

![users](https://github.com/RicardoGeek/ugram/blob/main/docs/intents.PNG)

Y para cada intent se configuraron las siguientes respuestas

![users](https://github.com/RicardoGeek/ugram/blob/main/docs/intent-1.PNG)

![users](https://github.com/RicardoGeek/ugram/blob/main/docs/intent-2.PNG)

![users](https://github.com/RicardoGeek/ugram/blob/main/docs/intent3.PNG)

## Translate

Se agregaron servicios de traduccion a las descripciones de las paginas con multiples idiomas.
