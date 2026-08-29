package com.wolfordering.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.Window;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        /*
         * IMPORTANTO PARA EL SHELL WEB DE WOLF:
         * El PWA se comporta como una ventana normal: el header empieza
         * debajo de la barra de estado. En Android no debemos dibujar el
         * WebView por detrás del status/navigation bar porque eso puede
         * desplazar la zona táctil del header y del menú.
         */
        Window window = getWindow();

        // Android debe reservar el área del sistema para el WebView.
        WindowCompat.setDecorFitsSystemWindows(window, true);

        // Barras separadas del contenido, como en la PWA.
        window.setStatusBarColor(Color.BLACK);
        window.setNavigationBarColor(Color.BLACK);

        WindowInsetsControllerCompat insetsController =
                WindowCompat.getInsetsController(
                        window,
                        window.getDecorView()
                );

        // UI oscura: iconos claros en ambas barras.
        insetsController.setAppearanceLightStatusBars(false);
        insetsController.setAppearanceLightNavigationBars(false);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            // Evita que Android aplique un scrim/transparencia que cambie
            // visualmente el borde inferior del WebView.
            window.setNavigationBarContrastEnforced(false);
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel ordersChannel =
                    new NotificationChannel(
                            "orders",
                            "Nuevos pedidos",
                            NotificationManager.IMPORTANCE_HIGH
                    );

            ordersChannel.setDescription(
                    "Notificaciones de nuevos pedidos"
            );

            ordersChannel.enableVibration(true);

            NotificationManager manager =
                    getSystemService(NotificationManager.class);

            if (manager != null) {
                manager.createNotificationChannel(ordersChannel);
            }
        }
    }
}
