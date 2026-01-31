package com.livego.premium;

import android.content.Context;
import android.webkit.JavascriptInterface;

/**
 * Esta classe atua como uma ponte entre o código JavaScript executado na WebView
 * e o código nativo Java/Kotlin do aplicativo Android.
 */
public class WebAppInterface {
    private Context mContext;

    /**
     * Instancia a interface e armazena o contexto da aplicação.
     * @param c O contexto da Activity principal.
     */
    WebAppInterface(Context c) {
        mContext = c;
    }

    /**
     * Mostra uma notificação nativa do sistema.
     * Este método é exposto ao JavaScript e pode ser chamado usando `window.Android.showNotification(title, text);`.
     * A anotação @JavascriptInterface é obrigatória para que o método seja acessível.
     *
     * @param title O título da notificação.
     * @param text O corpo da mensagem da notificação.
     */
    @JavascriptInterface
    public void showNotification(String title, String text) {
        if (title != null && !title.isEmpty() && text != null && !text.isEmpty()) {
            NotificationHelper.showNotification(mContext, title, text);
        }
    }
}
