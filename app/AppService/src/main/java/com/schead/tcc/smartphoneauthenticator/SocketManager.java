package com.schead.tcc.smartphoneauthenticator;

import android.app.admin.DevicePolicyManager;
import android.content.Context;

import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;

import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;

public class SocketManager {

    private final String URI = "https://tccmarcos.labsec.ufsc.br:8080";
    private Socket socket;

    public SocketManager(Notifier notifier) {
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

            }).on(AuthenticatedEvent.NAME, new AuthenticatedEvent(notifier))
            .on(UnauthorizedEvent.NAME, new UnauthorizedEvent())
            .on(NewValueEvent.NAME, new NewValueEvent(notifier))
            .on(Socket.EVENT_DISCONNECT, new Emitter.Listener() {

                @Override
                public void call(Object... args) {
                    System.out.println("disconectou");
                }

            });

            socket.connect();

        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
    }
}
