# Manual de Deploy e Configuração na VPS - LiveGo

Este guia cobre o processo de deploy e a nova estrutura de configuração simplificada.

**Pré-requisitos:**
1.  Os arquivos do projeto estão em `/var/www/livego10`.
2.  Você tem Nginx, PM2, e Docker (para o MongoDB) instalados e configurados.

---

### Estrutura de Configuração Unificada

Para simplificar seu fluxo de trabalho, toda a configuração do projeto (frontend e backend) agora reside em um único arquivo na raiz do projeto:

-   `.env`: **Este é o único arquivo que você precisa editar.** Ele contém todas as chaves de API, URLs de banco de dados e configurações para o ambiente de produção.

**Como funciona:**
-   **Backend:** O servidor Node.js (iniciado pelo PM2) lê este arquivo `.env` para obter as configurações de porta, banco de dados, JWT, etc.
-   **Frontend:** Durante o processo de build (`npm run build`), o Vite lê as variáveis que começam com `VITE_` deste mesmo arquivo `.env` e as injeta no código do frontend.

Isso elimina a necessidade de múltiplos arquivos (`config.env`, `.env.production`) e garante que ambos os ambientes usem a mesma base de configuração.

---

### Processo de Deploy (A Qualquer Momento que Atualizar o Código)

**Passo 1: Dê Permissão de Execução ao Script (Apenas na primeira vez)**

```bash
cd /var/www/livego10
chmod +x deploy.sh
```

**Passo 2: Execute o Deploy**

Após fazer qualquer alteração no código (incluindo no arquivo `.env`), execute este script para publicar as atualizações.

```bash
./deploy.sh
```

**O que o script faz automaticamente:**
1.  **Instalação:** Roda `npm install` para garantir que todas as dependências estejam atualizadas.
2.  **Compilação:** Roda `npm run build`, que compila o backend e o frontend usando as configurações do `.env`.
3.  **Reinicialização:** Usa `pm2 startOrRestart` para atualizar a aplicação no ar com **zero downtime**.
4.  **Persistência:** Salva o processo do PM2 para que a API reinicie com o servidor.

---

### Pós-Deploy: Configuração do Nginx

A configuração do Nginx permanece a mesma. Ele é responsável por servir os arquivos do frontend e redirecionar as chamadas de API para o backend.

1.  **Copie a Configuração (se ainda não fez):**
    ```bash
    sudo cp /var/www/livego10/nginx/default.conf /etc/nginx/sites-available/livego
    ```

2.  **Ative o Site (se ainda não fez):**
    ```bash
    sudo ln -s /etc/nginx/sites-available/livego /etc/nginx/sites-enabled/
    ```

3.  **Teste e Reinicie o Nginx:**
    ```bash
    sudo nginx -t
    sudo systemctl restart nginx
    ```

Seu site estará online, com frontend e backend configurados pelo mesmo arquivo `.env`.
