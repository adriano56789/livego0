package com.livego.premium;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

public class NotificationHelper {

    private static final String CHANNEL_ID = "livego_channel_id";
    private static final String CHANNEL_NAME = "LiveGo Notificações";
    private static final String CHANNEL_DESCRIPTION = "Notificações gerais do aplicativo LiveGo";

    /**
     * Cria o canal de notificação. É seguro chamar este método múltiplas vezes.
     * Para Android 8.0 (API 26) e superior, um canal de notificação é obrigatório.
     */
    public static void createNotificationChannel(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, CHANNEL_NAME, NotificationManager.IMPORTANCE_DEFAULT);
            channel.setDescription(CHANNEL_DESCRIPTION);
            
            NotificationManager notificationManager = context.getSystemService(NotificationManager.class);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }
    }

    /**
     * Constrói e exibe uma notificação nativa simples.
     * @param context Contexto da aplicação.
     * @param title O título da notificação.
     * @param text O corpo da mensagem da notificação.
     */
    public static void showNotification(Context context, String title, String text) {
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_notification) // Ícone da notificação (adicione em res/drawable)
                .setContentTitle(title)
                .setContentText(text)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setAutoCancel(true); // A notificação desaparece ao ser tocada

        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(context);

        // O Android lida com a verificação de permissão. Se não for concedida, a notificação não aparece.
        // O ID da notificação (0) pode ser qualquer inteiro. Usar um ID diferente para cada notificação permite mostrar várias.
        try {
            notificationManager.notify(0, builder.build());
        } catch (SecurityException e) {
            // Isso pode acontecer se a permissão POST_NOTIFICATIONS não for concedida no Android 13+.
            // A solicitação de permissão deve ser tratada pelo sistema.
            System.err.println("Permissão de notificação não concedida: " + e.getMessage());
        }
    }
}
