# Configuração da Infraestrutura Docker para LiveGo

Este documento detalha a configuração da infraestrutura Docker para os serviços SRS (Simple Realtime Server) e Nginx, incluindo a configuração de certificados TLS/HTTPS e autenticação.

## 1. Estrutura de Diretórios na VPS

A nova infraestrutura Docker foi configurada no diretório `/root/infra-livego/` na sua VPS. A estrutura de diretórios é a seguinte:

```
/root/infra-livego/
├── docker-compose.yml
├── nginx/
│   ├── certs/
│   │   ├── fullchain.pem
│   │   └── privkey.pem
│   ├── conf/
│   │   └── nginx.conf
│   └── html/
└── srs/
    ├── conf/
    │   └── srs.conf
    └── objs/
```

## 2. Configuração do Docker Compose (`docker-compose.yml`)

O arquivo `docker-compose.yml` define os três novos serviços Docker:

```yaml
services:
  srs:
    image: ossrs/srs:5
    container_name: livego_srs_v2
    restart: always
    command: ["./objs/srs", "-c", "conf/srs.conf"]
    ports:
      - "19350:1935" # RTMP
      - "19850:1985" # HTTP API
      - "8082:8080"  # HTTP Server
      - "8002:8000/udp" # WebRTC UDP
    volumes:
      - /root/infra-livego/srs/conf/srs.conf:/usr/local/srs/conf/srs.conf
    networks:
      - livego_network

  nginx:
    image: nginx:latest
    container_name: livego_nginx_v2
    restart: always
    ports:
      - "8081:80"  # HTTP
      - "8443:443" # HTTPS
    volumes:
      - /root/infra-livego/nginx/conf/nginx.conf:/etc/nginx/nginx.conf:ro
      - /root/infra-livego/nginx/certs:/etc/nginx/certs:ro
      - /root/infra-livego/nginx/html:/usr/share/nginx/html:ro
    networks:
      - livego_network
    depends_on:
      - srs

  webrtc_tester:
    image: ossrs/srs:5
    container_name: livego_webrtc_v2
    restart: always
    networks:
      - livego_network

networks:
  livego_network:
    driver: bridge
```

**Observações:**
*   As portas do SRS foram mapeadas para evitar conflitos com o SRS já existente (`livego_srs`). As novas portas são `19350` (RTMP), `19850` (HTTP API), `8082` (HTTP Server) e `8002/udp` (WebRTC UDP).
*   O Nginx está escutando nas portas `8081` (HTTP) e `8443` (HTTPS).
*   O `webrtc_tester` é um container SRS adicional que pode ser usado para testes de WebRTC, sem uma configuração específica de `srs.conf` montada, utilizando a configuração padrão da imagem.

## 3. Configuração do SRS (`srs.conf`)

O arquivo `/root/infra-livego/srs/conf/srs.conf` foi configurado com as seguintes diretivas principais:

```ini
listen              1935;
max_connections     1000;
daemon              off;
srs_log_tank        console;

http_api {
    enabled         on;
    listen          1985;
}

http_server {
    enabled         on;
    listen          8080;
    dir             ./objs/nginx/html;
}

rtc_server {
    enabled on;
    listen 8000;
    candidate 72.60.249.175; # IP público da VPS para WebRTC
}

vhost __defaultVhost__ {
    rtc {
        enabled     on;
        rtmp_to_rtc on;
        rtc_to_rtmp on;
    }
    
    http_hooks {
        enabled         on;
        # Callbacks para a API local (assumindo que a API está acessível em 172.17.0.1:3000 na rede Docker)
        on_publish      http://172.17.0.1:3000/api/srs/publish;
        on_unpublish    http://172.17.0.1:3000/api/srs/unpublish;
        on_play         http://172.17.0.1:3000/api/srs/play;
        on_stop         http://172.17.0.1:3000/api/srs/stop;
    }
}
```

**Observações:**
*   O `candidate` para `rtc_server` foi definido como `72.60.249.175`, que é o IP público da sua VPS, essencial para o funcionamento correto do WebRTC.
*   Os `http_hooks` foram configurados para apontar para `http://172.17.0.1:3000/api/srs/...`. Este IP (`172.17.0.1`) é o gateway da rede `bridge` padrão do Docker, permitindo que o container SRS se comunique com a API que está rodando diretamente na VPS na porta `3000`.

## 4. Configuração do Nginx (`nginx.conf`)

O arquivo `/root/infra-livego/nginx/conf/nginx.conf` foi configurado como um proxy reverso para o SRS, com suporte a WebSocket e HTTPS:

```nginx
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    keepalive_timeout  65;

    server {
        listen 80;
        server_name livego.store;
        
        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
        }

        # Proxy para SRS WebSocket (WebRTC signaling)
        location /rtc/ {
            proxy_pass http://srs:1985/rtc/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
        }
    }

    server {
        listen 443 ssl;
        server_name livego.store;

        ssl_certificate     /etc/nginx/certs/fullchain.pem;
        ssl_certificate_key /etc/nginx/certs/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
        }

        # Proxy para SRS HTTP API (WSS)
        location /rtc/ {
            proxy_pass http://srs:1985/rtc/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
        }
    }
}
```

**Observações:**
*   O Nginx está configurado para servir conteúdo estático do diretório `/usr/share/nginx/html` (que pode ser usado para uma página de teste ou frontend). Você pode colocar um `index.html` simples neste diretório para testar.
*   As configurações de `location /rtc/` atuam como proxy reverso para o container `srs` (nome do serviço no `docker-compose.yml`) na porta `1985` (HTTP API do SRS), suportando WebSocket (`Upgrade` e `Connection`).
*   Os certificados TLS (`fullchain.pem` e `privkey.pem`) foram copiados do seu diretório Let's Encrypt existente (`/etc/letsencrypt/live/livego.store/`) para `/root/infra-livego/nginx/certs/` e são usados pelo Nginx para HTTPS na porta `8443`.

## 5. Status dos Containers Docker

Os novos containers `livego_srs_v2`, `livego_nginx_v2` e `livego_webrtc_v2` foram iniciados com sucesso. Você pode verificar o status com o comando:

```bash
sshpass -p "adriano" ssh -o StrictHostKeyChecking=no root@72.60.249.175 "docker ps"
```

Você deverá ver os três containers listados com o status `Up`.

## 6. Credenciais

A senha fornecida para acesso SSH à VPS é `adriano`.

## 7. Próximos Passos e Validação

Para validar a configuração, você pode:
1.  Acessar `http://livego.store:8081` ou `https://livego.store:8443` (se o DNS estiver configurado para apontar para sua VPS) para verificar se o Nginx está respondendo.
2.  Testar a API do SRS através do Nginx, por exemplo, acessando `https://livego.store:8443/rtc/v1/version` (se o DNS estiver configurado).
3.  Testar a publicação e reprodução de streams WebRTC e RTMP usando as portas e configurações especificadas.

Se precisar de uma URL para o aplicativo, você pode usar `livego.store` (se o DNS estiver configurado para apontar para o IP da VPS) ou diretamente o IP da VPS com as portas mapeadas (`72.60.249.175:8081` para HTTP, `72.60.249.175:8443` para HTTPS).

Por favor, me informe se precisar de mais alguma validação ou ajuste.
