package com.livego.premium;

import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Manter a tela sempre ativa
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        // Ativar modo de tela cheia imersiva
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        WindowInsetsControllerCompat controller = new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView());
        controller.hide(WindowInsetsCompat.Type.systemBars());
        controller.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);

        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);

        // --- INÍCIO DA CONFIGURAÇÃO DA WEBVIEW ---
        WebSettings webSettings = webView.getSettings();

        // [ESSENCIAL] Habilita a execução de JavaScript.
        webSettings.setJavaScriptEnabled(true);

        // [ESSENCIAL] Permite o armazenamento de dados no DOM (localStorage), crucial para salvar sessões, tokens, etc.
        webSettings.setDomStorageEnabled(true);

        // [CRÍTICO PARA AUTOPLAY] Permite que vídeos e áudios comecem a tocar automaticamente sem um gesto do usuário.
        // Essencial para que as transmissões ao vivo comecem a ser exibidas assim que a sala for aberta.
        webSettings.setMediaPlaybackRequiresUserGesture(false);

        // Permite acesso a arquivos, útil para uploads ou cache.
        webSettings.setAllowFileAccess(true);

        // Permite que o JavaScript abra novas janelas (usado para alguns fluxos de OAuth, por exemplo).
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
        
        // Define um User-Agent de produção
        webSettings.setUserAgentString("Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Mobile Safari/537.36 LiveGoApp/1.0");

        // --- INÍCIO DA INTEGRAÇÃO NATIVA ---

        // 1. Cria o canal de notificações (obrigatório para Android 8+)
        NotificationHelper.createNotificationChannel(this);

        // 2. Adiciona a interface JavaScript para permitir que o site chame o código nativo
        webView.addJavascriptInterface(new WebAppInterface(this), "Android");
        
        // --- FIM DA INTEGRAÇÃO NATIVA ---

        webView.setWebViewClient(new WebViewClient());

        // [CRÍTICO PARA WEBRTC] O WebChromeClient é responsável por lidar com eventos da UI do navegador,
        // como alertas, e, mais importante, solicitações de permissão.
        webView.setWebChromeClient(new WebChromeClient() {
            /**
             * Este método é invocado quando a página web solicita permissões de hardware,
             * como câmera e microfone, através da API getUserMedia.
             */
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                // Concede automaticamente as permissões de câmera e microfone solicitadas pela WebView
                // para garantir que o WebRTC funcione sem a necessidade de um prompt de permissão nativo adicional.
                // As permissões do app já foram declaradas no AndroidManifest.xml.
                runOnUiThread(() -> {
                     String[] resources = request.getResources();
                     for (String resource : resources) {
                         if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(resource) ||
                             PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(resource)) {
                             request.grant(resources);
                             return;
                         }
                     }
                     // Nega quaisquer outras solicitações de permissão não esperadas.
                     request.deny();
                 });
            }
        });

        // URL de produção do frontend (HTTPS é suportado por padrão e é um requisito para WebRTC)
        webView.loadUrl("https://livego.store");
    }

    // Gerencia o botão "Voltar" para navegar na WebView
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}