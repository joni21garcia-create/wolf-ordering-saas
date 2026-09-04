package com.wolfordering.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {

        // Registrar el plugin nativo de descargas de Wolf
        registerPlugin(WolfDownloadPlugin.class);

        super.onCreate(savedInstanceState);

        /*
         * WOLF — SAFE AREA FIX
         *
         * Android 15+ enforces edge-to-edge for apps targeting recent SDKs.
         * The previous implementation explicitly disabled decor fitting and
         * then returned the insets without consuming/applying them. That lets
         * the WebView/shell occupy the status-bar area and can place the top
         * navbar under the system bar, making the controls difficult to touch.
         *
         * We keep the window edge-to-edge compatible, but explicitly reserve
         * the system-bar insets at the native root. This makes the WebView's
         * actual layout/touch viewport start below the status bar and end above
         * the navigation/gesture area, matching the effective PWA layout.
         */

        final Window window = getWindow();

        WindowCompat.setDecorFitsSystemWindows(window, false);

        // Keep system bars visually clean for Wolf's dark UI.
        window.setStatusBarColor(Color.BLACK);
        window.setNavigationBarColor(Color.BLACK);

        final WindowInsetsControllerCompat controller =
                WindowCompat.getInsetsController(
                        window,
                        window.getDecorView()
                );

        controller.setAppearanceLightStatusBars(false);
        controller.setAppearanceLightNavigationBars(false);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.setNavigationBarContrastEnforced(false);
        }

        final View rootView = window.getDecorView();

        ViewCompat.setOnApplyWindowInsetsListener(
                rootView,
                (view, insets) -> {
                    Insets bars = insets.getInsets(
                            WindowInsetsCompat.Type.systemBars()
                    );

                    /*
                     * Reserve the native safe area exactly once.
                     * We don't use the IME inset here so the keyboard does not
                     * permanently change the shell geometry.
                     */
                    view.setPadding(
                            0,
                            bars.top,
                            0,
                            bars.bottom
                    );

                    return insets;
                }
        );

        // Trigger the listener immediately after registration.
        ViewCompat.requestApplyInsets(rootView);

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