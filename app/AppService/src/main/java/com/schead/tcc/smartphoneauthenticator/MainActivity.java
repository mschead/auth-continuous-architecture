package com.schead.tcc.smartphoneauthenticator;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.TaskStackBuilder;
import android.app.admin.DevicePolicyManager;
import android.content.Context;
import android.content.Intent;
import android.support.v4.app.NotificationCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.view.View;

import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;

import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    private Socket socket;
    private final String URI = "https://tccmarcos.labsec.ufsc.br:8080";
    private Map<String, Double> pesos = new HashMap<>();
    private Double currentNDC = 100.00;

    public void sendMessage(View view) {
//        Intent intent = new Intent(this, DeviceListActivity.class);
//        EditText editText = (EditText) findViewById(R.id.editText);
//        String message = editText.getText().toString();
//        intent.putExtra(EXTRA_MESSAGE, message);
//        startActivity(intent);
        System.out.println("estoy aqui!");
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        
        pesos.put("device_001", 1.0);
        try {
            socket = IO.socket(URI);
            socket.on(Socket.EVENT_CONNECT, new Emitter.Listener() {

                @Override
                public void call(Object... args) {
                    JSONObject obj = new JSONObject();
                    try {
                        obj.put("username", "service_001");
                        obj.put("password", "service_001");
                        socket.emit("authentication", obj);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }

            }).on("authenticated", new Emitter.Listener() {

                @Override
                public void call(Object... args) {
                    showNotification(100,"It's seems you own this device");
                }

            }).on("unauthorized", new Emitter.Listener() {

                @Override
                public void call(Object... args) {
                    System.out.println("Wrong credentials.");
                }

            }).on("newValue", new Emitter.Listener() {

                @Override
                public void call(Object... args) {

                    try {
                        String name = ((JSONObject) args[0]).getString("device");
                        double value = ((JSONObject) args[0]).getDouble("value");
                        double nextNDC = 53.6; //getNextNDC(name, value);

                        if (nextNDC < 60.0) {
                            showNotification(53.6, "Please, authenticate yourself again!");
                            DevicePolicyManager mDP = (DevicePolicyManager) getSystemService(Context.DEVICE_POLICY_SERVICE);
                            mDP.lockNow();
                        } else {
                            showNotification(value, "It's seems you own this device");
                        }

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }



                }

            }).on(Socket.EVENT_DISCONNECT, new Emitter.Listener() {

                @Override
                public void call(Object... args) {}

            });

            socket.connect();

            JSONObject joinObj = new JSONObject();
            try {
                joinObj.put("name", "device_001");
                socket.emit("join", joinObj);
            } catch (JSONException e) {
                e.printStackTrace();
            }

        } catch (URISyntaxException e) {
            e.printStackTrace();
        }


    }

    private double getNextNDC(String senderDevice, double senderValue) {
        double outrosPesos = 0.0;
        double senderNDC = 0.0;

        for (String device : pesos.keySet()) {
            if (device.equals(senderDevice)) {
                senderNDC = senderValue * pesos.get(device);
            } else {
                outrosPesos += pesos.get(device);
            }
        }

        return (currentNDC * outrosPesos + senderNDC) / (outrosPesos + pesos.get(senderDevice));
    }

    private void showNotification(double value, String message) {
        NotificationCompat.Builder mBuilder =
                new NotificationCompat.Builder(this, "0")
                        .setSmallIcon(R.drawable.lock)
                        .setContentTitle("Last NDC: " + value)
                        .setContentText(message)
                        .setOngoing(true);

        // Creates an explicit intent for an Activity in your app
        NotificationManager mNotificationManager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        // mId allows you to update the notification later on.
        mNotificationManager.notify(1, mBuilder.build());
    }

}
