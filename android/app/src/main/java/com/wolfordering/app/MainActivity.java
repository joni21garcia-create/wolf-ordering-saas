package com.wolfordering.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;
import android.os.Bundle;
import android.graphics.Color;
import android.view.Window;

import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Edge-to-edge: el contenido puede ocupar toda la pantalla,
        // incluyendo detrás de la barra de navegación de Android.
        Window window = getWindow();

        WindowCompat.setDecorFitsSystemWindows(
                window,
                false
        );

        window.setStatusBarColor(Color.TRANSPARENT);
        window.setNavigationBarColor(Color.TRANSPARENT);

        WindowInsetsControllerCompat insetsController =
                WindowCompat.getInsetsController(
                        window,
                        window.getDecorView()
                );

        // Iconos oscuros para fondos claros.
        // Si tu interfaz mantiene fondo oscuro, cambia ambos a false.
        insetsController.setAppearanceLightStatusBars(false);
        insetsController.setAppearanceLightNavigationBars(false);

        ViewCompat.setOnApplyWindowInsetsListener(
                window.getDecorView(),
                (view, insets) -> {
                    // Dejamos que el contenido llegue hasta el borde.
                    // Los componentes que necesiten espacio seguro
                    // pueden usar env.windowInsets / CSS safe-area.
                    return insets;
                }
        );

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