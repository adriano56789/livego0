# Documentação do Projeto LiveGo

## 1. Acesso à VPS

### Conexão SSH
```bash
ssh root@72.60.249.175
```
Senha: `adriano`

### Estrutura de Diretórios
- Diretório principal: `/root/infra-livego`
- Configurações do Nginx: `/root/infra-livego/nginx`
- Configurações do SRS: `/root/infra-livego/srs`
- Certificados: `/etc/letsencrypt/live/livego.store`

## 2. Serviços e Portas

### Nginx
- HTTP: 8081
- HTTPS: 8443
- Domínio: livego.store

### SRS (Streaming Server)
- RTMP: 19350
- HTTP API: 19850
- HTTP Server: 8082
- WebRTC UDP: 8002

## 3. Comandos Essenciais

### Gerenciamento de Containers
```bash
# Navegar para o diretório do projeto
cd /root/infra-livego

# Iniciar todos os serviços
docker-compose up -d

# Parar todos os serviços
docker-compose down

# Verificar logs
docker-compose logs -f

# Listar containers em execução
docker ps
```

### Nomes dos Containers
- SRS: `livego_srs_v2`
- Nginx: `livego_nginx_v2`
- WebRTC Tester: `livego_webrtc_v2`

## 4. URLs de Acesso

### Nginx
- HTTP: `http://72.60.249.175:8081`
- HTTPS: `https://livego.store:8443` (requer configuração de DNS)

### SRS API
- API: `http://72.60.249.175:19850`
- HTTP Server: `http://72.60.249.175:8082`

### Streams
- RTMP: `rtmp://72.60.249.175:19350/live/stream`
- WebRTC Publish: `webrtc://72.60.249.175:8002/live/stream`
- WebRTC Play: `webrtc://72.60.249.175:8002/live/stream`

## 5. Configurações de Rede
- IP Público: 72.60.249.175
- IP da Rede Docker: 172.17.0.1
- Domínio: livego.store

## 6. Segurança
- Certificados TLS: `/etc/letsencrypt/live/livego.store`
- Chaves SSH: `~/.ssh/`

## 7. Solução de Problemas

### Verificar Status dos Serviços
```bash
docker-compose ps
docker logs <container_name>
```

### Reiniciar Serviços
```bash
docker-compose restart
```

### Atualizar Configurações
1. Edite os arquivos de configuração
2. Reconstrua os containers:
   ```bash
   docker-compose up -d --build
   ```

## 8. Backup
É recomendado fazer backup regular dos seguintes diretórios:
- `/root/infra-livego`
- `/etc/letsencrypt`
- Configurações do banco de dados (se aplicável)
