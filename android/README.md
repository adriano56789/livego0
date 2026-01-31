# Manual do Projeto Android - LiveGo

Este documento serve como um guia completo para configurar, customizar, compilar e manter o wrapper nativo Android para a aplicação web LiveGo.

## 1. Estrutura do Projeto

O aplicativo Android é, em essência, um "wrapper" para a aplicação web principal. Ele consiste em uma `MainActivity` que contém uma `WebView` em tela cheia. A `WebView` é configurada para carregar a URL do seu frontend e para solicitar as permissões de hardware necessárias (câmera, microfone) para o funcionamento do streaming.

-   **`app/`**: Contém todo o código-fonte, recursos e configurações do aplicativo.
-   **`app/src/main/java/com/livego/premium/`**: Onde reside o código Java.
    -   `MainActivity.java`: A tela principal que hospeda a WebView.
    -   `WebAppInterface.java`: A "ponte" que permite ao JavaScript chamar código nativo.
    -   `NotificationHelper.java`: Classe que gerencia a criação de notificações do sistema.
-   **`app/src/main/AndroidManifest.xml`**: Define as permissões, componentes e metadados do app.
-   **`app/build.gradle`**: Onde você configura o ID do aplicativo, versão e outras dependências.
-   **`app/src/main/res/`**: Contém todos os recursos do app (ícones, layouts, strings).

---

## 2. Configuração do Ambiente

### Requisitos

-   [Android Studio](https://developer.android.com/studio) (versão mais recente recomendada).
-   Java Development Kit (JDK) - Geralmente vem embutido no Android Studio.

### Passos para Abrir o Projeto

1.  Abra o Android Studio.
2.  Na tela de boas-vindas, selecione **"Open"**.
3.  Navegue até a pasta raiz do seu projeto `livego-unified` e selecione a pasta `android/`.
4.  Clique em **"Open"**.
5.  O Android Studio irá sincronizar o projeto usando o Gradle. Este processo pode levar alguns minutos na primeira vez.

---

## 3. Guia de Customização

Esta seção explica como alterar as informações principais do aplicativo.

### 3.1. Alterar a URL da WebView

Esta é a configuração mais importante. É a URL que o aplicativo irá carregar.

1.  Abra o arquivo: `app/src/main/java/com/livego/premium/MainActivity.java`.
2.  Encontre a linha no final do método `onCreate`:
    ```java
    webView.loadUrl("https://livego.store");
    ```
3.  Substitua `"https://livego.store"` pela URL do seu frontend.

### 3.2. Alterar o Nome do Aplicativo

O nome que aparece abaixo do ícone do app.

1.  Abra o arquivo: `app/src/main/res/values/strings.xml`.
2.  Altere o valor da string `app_name`:
    ```xml
    <string name="app_name">Seu Novo Nome</string>
    ```

### 3.3. Alterar o Ícone do Aplicativo

1.  No Android Studio, clique com o botão direito na pasta `app/` no painel do projeto.
2.  Vá em **New > Image Asset**.
3.  Na aba **Foreground Layer**, selecione o `Asset Type` como `Image` e escolha seu arquivo de ícone (preferencialmente 1024x1024px).
4.  Ajuste o `Resize` para garantir que o ícone se encaixe bem na área segura.
5.  Vá para a aba **Background Layer** e configure uma cor de fundo se o seu ícone não for quadrado.
6.  Clique em **Next** e depois em **Finish** para que o Android Studio gere todas as densidades de ícone necessárias e substitua os arquivos existentes em `res/mipmap-*`.

### 3.4. Alterar o ID do Pacote e a Versão

O `applicationId` é o identificador único do seu app na Google Play Store.

1.  Abra o arquivo: `app/build.gradle`.
2.  Dentro do bloco `defaultConfig`, modifique os seguintes campos:
    ```groovy
    android {
        defaultConfig {
            applicationId "com.suaempresa.seunome" // Mude para um ID único
            versionCode 1                         // Incremente a cada nova versão (ex: 2, 3, 4...)
            versionName "1.0.0"                   // A versão visível para o usuário (ex: 1.0.1)
        }
        ...
    }
    ```

---

## 4. Compilando o Aplicativo (APK / AAB)

### Gerando um APK para Testes

O APK é um arquivo que pode ser instalado diretamente em um dispositivo Android para testes.

1.  No menu superior, vá em **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
2.  Após a compilação, uma notificação aparecerá no canto inferior direito. Clique em **"locate"** para encontrar o arquivo `app-debug.apk` na pasta `app/build/outputs/apk/debug/`.

### Gerando um AAB para a Google Play Store

O AAB (Android App Bundle) é o formato exigido para publicação na Google Play.

1.  No menu superior, vá em **Build > Generate Signed Bundle / APK...**.
2.  Selecione **Android App Bundle** e clique em **Next**.
3.  Se você já tem uma chave de assinatura, selecione-a. Se não, clique em **"Create new..."** e preencha o formulário para criar seu keystore. **Guarde este arquivo e as senhas em um local seguro! Você precisará dele para todas as futuras atualizações.**
4.  Após selecionar sua chave, clique em **Next**.
5.  Selecione a variante `release` e clique em **Finish**.
6.  O Android Studio irá gerar o arquivo `app-release.aab` na pasta `app/release/`.

---

## 5. Permissões Explicadas

O arquivo `AndroidManifest.xml` declara as permissões que o aplicativo necessita.

-   `android.permission.INTERNET`: **Essencial.** Permite que a WebView acesse a internet para carregar seu site.
-   `android.permission.ACCESS_NETWORK_STATE`: Permite ao app verificar se há conexão com a internet.
-   `android.permission.CAMERA`: **Essencial.** Permite que a WebView acesse a câmera para as transmissões ao vivo.
-   `android.permission.RECORD_AUDIO`: **Essencial.** Permite que a WebView acesse o microfone.
-   `android.permission.MODIFY_AUDIO_SETTINGS`: Melhora o controle de áudio durante chamadas WebRTC.
-   `android.permission.WAKE_LOCK`: Impede que a tela do dispositivo se apague durante uma transmissão ao vivo.
-   `android.permission.POST_NOTIFICATIONS`: **Essencial.** Permite que o app envie notificações para o usuário no Android 13 e superior.

---

## 6. Integrações Nativas

### Notificações via JavaScript

Você pode disparar notificações nativas diretamente do seu código frontend (que roda na WebView).

**Como usar:**
No seu código JavaScript, chame a seguinte função:

```javascript
if (window.Android && typeof window.Android.showNotification === 'function') {
    window.Android.showNotification('Título da Notificação', 'Corpo da mensagem aqui.');
}
```

-   `window.Android` é o nome da interface que foi exposta ao JavaScript.
-   `showNotification(title, text)` é o método que dispara a notificação.

**Importante:** A permissão para notificações (`POST_NOTIFICATIONS`) é uma permissão de tempo de execução no Android 13+. A primeira vez que `showNotification` for chamado, o sistema operacional irá perguntar ao usuário se ele permite que o app envie notificações. Se o usuário negar, as chamadas subsequentes não farão nada.

---

## 7. Configuração da WebView para WebRTC & Live Streaming

A configuração da `WebView` é otimizada para suportar as tecnologias modernas necessárias para uma aplicação de streaming em tempo real. As configurações-chave estão no arquivo `MainActivity.java`.

### 7.1. Configurações Principais (`WebSettings`)

-   **`setJavaScriptEnabled(true)`**: Essencial para executar a lógica do frontend.
-   **`setDomStorageEnabled(true)`**: Habilita `localStorage`, permitindo que o app web salve tokens de sessão e preferências do usuário.
-   **`setMediaPlaybackRequiresUserGesture(false)`**: **Configuração crítica** que permite o autoplay de vídeo e áudio. Sem isso, o usuário teria que tocar na tela para iniciar cada transmissão ao vivo.
-   **Suporte a HTTPS e WebSocket**: A `WebView` moderna suporta ambos nativamente. O uso de HTTPS é um requisito obrigatório para o `getUserMedia` funcionar.

### 7.2. Tratamento de Permissões (`WebChromeClient`)

Para que o WebRTC funcione, a aplicação web precisa solicitar acesso à câmera e ao microfone através da API `getUserMedia()`. A `WebView` intercepta essa solicitação e a repassa para o `WebChromeClient`.

-   **`onPermissionRequest(PermissionRequest request)`**: Este método foi implementado para **conceder automaticamente** as permissões de `RESOURCE_VIDEO_CAPTURE` (câmera) e `RESOURCE_AUDIO_CAPTURE` (microfone). Isso proporciona uma experiência de usuário fluida, evitando um segundo pop-up de permissão nativo, já que as permissões do aplicativo já foram solicitadas no `AndroidManifest.xml`.

### 7.3. Permissões do Aplicativo (`AndroidManifest.xml`)

O aplicativo declara as seguintes permissões de hardware, que são pré-requisitos para que a `WebView` possa acessá-los:

-   `android.permission.INTERNET`: Acesso à rede.
-   `android.permission.CAMERA`: Acesso à câmera.
-   `android.permission.RECORD_AUDIO`: Acesso ao microfone.
-   `android.permission.MODIFY_AUDIO_SETTINGS`: Permite um controle mais refinado do áudio, útil em cenários de WebRTC.
