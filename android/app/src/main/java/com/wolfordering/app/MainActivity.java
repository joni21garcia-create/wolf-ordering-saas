package com.wolfordering.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

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