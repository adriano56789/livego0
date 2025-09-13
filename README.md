# LiveGo Streaming App - Frontend & Backend

Este projeto contém a aplicação frontend completa do LiveGo e um servidor backend simulado para desenvolvimento e teste.

## Estrutura do Projeto

- **/src**: Contém todo o código-fonte do frontend da aplicação React.
- **/backend**: Contém um servidor Node.js/Express autônomo que simula a API real do LiveGo.
- **/public**: Arquivos públicos para o frontend.

---

## 1. Como Executar o Backend (Obrigatório para o App Funcionar)

O backend é um servidor Express que simula a API e precisa estar rodando para que o aplicativo frontend funcione corretamente.

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 16 ou superior) instalado.

### Passos

1.  **Abra um novo terminal** e navegue até a pasta do backend:
    ```bash
    cd backend
    ```

2.  **Instale as dependências** do servidor (só precisa fazer isso uma vez):
    ```bash
    npm install
    ```

3.  **Inicie o servidor**:
    ```bash
    node server.js
    ```

4.  Você verá uma mensagem de confirmação no terminal. Mantenha este terminal aberto enquanto usa o aplicativo.
    ```
    Servidor backend do LiveGo rodando em http://localhost:3001
    ```

## 2. Como Testar as APIs com o Postman

Use o Postman ou uma ferramenta similar para testar os endpoints. A URL base para todas as requisições é `http://localhost:3001`.

### Lista Completa de Endpoints da API

#### Autenticação
- `POST /api/auth/login`
  - **Descrição:** Autentica um usuário e retorna seus dados.
- `POST /api/auth/logout`
  - **Descrição:** Simula o logout do usuário.

#### Usuários (Users)
- `GET /api/users/me`
  - **Descrição:** Retorna os dados do usuário principal (logado).
- `PUT /api/users/me`
  - **Descrição:** Atualiza o perfil do usuário principal.
  - **Body (JSON):** `{ "name": "Novo Nome", "bio": "Nova bio aqui." }`
- `DELETE /api/users/me`
  - **Descrição:** Deleta a conta do usuário principal.
- `GET /api/users/search?q=:query`
  - **Descrição:** Busca por usuários por nome ou ID.
  - **Exemplo:** `GET http://localhost:3001/api/users/search?q=Lest`
- `GET /api/users/:id`
  - **Descrição:** Retorna os dados de um usuário específico.
  - **Exemplo:** `GET http://localhost:3001/api/users/55218901`
- `POST /api/users/:id/follow`
  - **Descrição:** Segue um usuário.
- `DELETE /api/users/:id/unfollow`
  - **Descrição:** Deixa de seguir um usuário.
- `GET /api/users/:id/fans`
  - **Descrição:** Retorna a lista de fãs (seguidores) de um usuário.
- `GET /api/users/:id/following`
  - **Descrição:** Retorna a lista de usuários que um usuário segue.
- `GET /api/users/:id/visitors`
  - **Descrição:** Retorna a lista de visitantes do perfil.

#### Bloqueio (Block)
- `GET /api/blocklist`
  - **Descrição:** Retorna a lista de usuários bloqueados pelo usuário atual.
- `POST /api/users/:id/block`
  - **Descrição:** Bloqueia um usuário.
- `DELETE /api/users/:id/unblock`
  - **Descrição:** Desbloqueia um usuário.

#### Carteira (Wallet)
- `GET /api/wallet/:userId`
  - **Descrição:** Retorna os dados da carteira de um usuário.
- `GET /api/wallet/:userId/history`
  - **Descrição:** Retorna o histórico de transações.
- `POST /api/wallet/:userId/purchase`
  - **Descrição:** Inicia uma compra de diamantes.
  - **Body (JSON):** `{ "packageAmount": 1050, "packagePrice": 49.99 }`
- `POST /api/wallet/:userId/withdraw`
  - **Descrição:** Solicita um saque de ganhos.
  - **Body (JSON):** `{ "amount": 50000, "methodId": "pix-123" }`
- `GET /api/wallet/:userId/methods`
  - **Descrição:** Retorna os métodos de saque salvos.
- `POST /api/wallet/:userId/methods`
  - **Descrição:** Salva um novo método de saque.
  - **Body (JSON):** `{ "type": "pix", "key": "email@example.com" }`

#### Mensagens (Messages)
- `GET /api/messages/:userId`
  - **Descrição:** Retorna um resumo de todas as conversas de um usuário.
- `GET /api/messages/:userId/:chatPartnerId`
  - **Descrição:** Retorna o histórico de chat com outro usuário.
- `POST /api/messages/:userId/:chatPartnerId`
  - **Descrição:** Envia uma mensagem em um chat.
  - **Body (JSON):** `{ "text": "Olá do Postman!" }`

#### Transmissões (Streams)
- `GET /api/streams`
  - **Descrição:** Retorna a lista de transmissões ao vivo.
- `POST /api/streams/start`
  - **Descrição:** Inicia uma nova transmissão.
  - **Body (JSON):** `{ "title": "Minha Live!", "isPrivate": false }`
- `POST /api/streams/:id/end`
  - **Descrição:** Encerra uma transmissão e retorna um resumo.
- `GET /api/streams/:id/viewers`
  - **Descrição:** Retorna a lista de espectadores em uma transmissão.
- `POST /api/streams/:id/gift`
  - **Descrição:** Envia um presente para uma transmissão.
  - **Body (JSON):** `{ "giftId": "coracao", "quantity": 10 }`

#### Geral
- `POST /api/reports`
  - **Descrição:** Envia uma denúncia ou feedback.
  - **Body (JSON):** `{ "reportedId": "99887705", "reason": "Spam", "details": "Usuário está enviando links suspeitos." }`