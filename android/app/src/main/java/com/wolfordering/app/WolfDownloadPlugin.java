package com.wolfordering.app;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.OutputStream;

@CapacitorPlugin(name = "WolfDownload")
public class WolfDownloadPlugin extends Plugin {

    private String makeUniqueFileName(String fileName) {

        if (fileName == null || fileName.trim().isEmpty()) {
            fileName = "comprobante-pago.png";
        }

        int extensionIndex = fileName.lastIndexOf(".");

        String baseName;
        String extension;

        if (extensionIndex > 0) {
            baseName = fileName.substring(0, extensionIndex);
            extension = fileName.substring(extensionIndex);
        } else {
            baseName = fileName;
            extension = ".png";
        }

        return baseName
                + "-"
                + System.currentTimeMillis()
                + extension;
    }

    @PluginMethod
    public void saveToDownloads(PluginCall call) {

        String data = call.getString("data");
        String requestedFileName = call.getString("fileName");
        String mimeType = call.getString(
                "mimeType",
                "application/octet-stream"
        );

        if (data == null || data.isEmpty()) {
            call.reject("No se recibieron datos del archivo.");
            return;
        }

        try {

            byte[] fileBytes = Base64.decode(
                    data,
                    Base64.DEFAULT
            );

            /*
             * Android necesita un nombre único.
             * Esto evita el error:
             *
             * Failed to build unique file
             */
            String fileName = makeUniqueFileName(
                    requestedFileName
            );

            ContentResolver resolver =
                    getContext().getContentResolver();

            ContentValues values = new ContentValues();

            values.put(
                    MediaStore.Downloads.DISPLAY_NAME,
                    fileName
            );

            values.put(
                    MediaStore.Downloads.MIME_TYPE,
                    mimeType
            );

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {

                values.put(
                        MediaStore.Downloads.RELATIVE_PATH,
                        Environment.DIRECTORY_DOWNLOADS
                );

                values.put(
                        MediaStore.Downloads.IS_PENDING,
                        1
                );
            }

            Uri uri = resolver.insert(
                    MediaStore.Downloads.EXTERNAL_CONTENT_URI,
                    values
            );

            if (uri == null) {

                call.reject(
                        "No se pudo crear el archivo en Descargas."
                );

                return;
            }

            try (
                    OutputStream outputStream =
                            resolver.openOutputStream(uri)
            ) {

                if (outputStream == null) {

                    resolver.delete(
                            uri,
                            null,
                            null
                    );

                    call.reject(
                            "No se pudo abrir el archivo para escritura."
                    );

                    return;
                }

                outputStream.write(fileBytes);
                outputStream.flush();
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {

                ContentValues completedValues =
                        new ContentValues();

                completedValues.put(
                        MediaStore.Downloads.IS_PENDING,
                        0
                );

                resolver.update(
                        uri,
                        completedValues,
                        null,
                        null
                );
            }

            JSObject result = new JSObject();

            result.put(
                    "success",
                    true
            );

            result.put(
                    "uri",
                    uri.toString()
            );

            result.put(
                    "fileName",
                    fileName
            );

            call.resolve(result);

        } catch (Exception e) {

            call.reject(
                    "No se pudo guardar el archivo en Descargas: "
                            + e.getMessage(),
                    e
            );
        }
    }
}