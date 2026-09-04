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
import java.util.UUID;

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

        /*
         * Generamos un nombre realmente único.
         * Esto evita conflictos en la carpeta Descargas
         * incluso si el usuario pulsa varias veces.
         */
        String uniqueId = UUID.randomUUID()
                .toString()
                .substring(0, 8);

        return baseName
                + "-"
                + uniqueId
                + extension;
    }

    @PluginMethod
    public void saveToDownloads(PluginCall call) {

        String data = call.getString("data");

        String requestedFileName = call.getString(
                "fileName"
        );

        String mimeType = call.getString(
                "mimeType",
                "application/octet-stream"
        );

        if (data == null || data.isEmpty()) {

            call.reject(
                    "No se recibieron datos del archivo."
            );

            return;
        }

        try {

            /*
             * Convertimos Base64 a bytes.
             */
            byte[] fileBytes = Base64.decode(
                    data,
                    Base64.DEFAULT
            );

            /*
             * Creamos un nombre único para Descargas.
             */
            String fileName = makeUniqueFileName(
                    requestedFileName
            );

            ContentResolver resolver =
                    getContext().getContentResolver();

            ContentValues values =
                    new ContentValues();

            values.put(
                    MediaStore.Downloads.DISPLAY_NAME,
                    fileName
            );

            values.put(
                    MediaStore.Downloads.MIME_TYPE,
                    mimeType
            );

            /*
             * Android 10+:
             * guardar directamente dentro de Descargas.
             */
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {

                values.put(
                        MediaStore.Downloads.RELATIVE_PATH,
                        Environment.DIRECTORY_DOWNLOADS
                );

                /*
                 * Mientras escribimos el archivo,
                 * Android lo mantiene pendiente.
                 */
                values.put(
                        MediaStore.Downloads.IS_PENDING,
                        1
                );
            }

            /*
             * Creamos el archivo.
             */
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

            /*
             * Escribimos los bytes del comprobante.
             */
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

            /*
             * Finalizamos el archivo.
             */
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

            /*
             * Respondemos a JavaScript.
             */
            JSObject result =
                    new JSObject();

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