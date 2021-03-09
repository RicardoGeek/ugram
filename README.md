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
