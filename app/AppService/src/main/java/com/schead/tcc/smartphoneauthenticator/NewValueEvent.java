package com.schead.tcc.smartphoneauthenticator;

import android.app.admin.DevicePolicyManager;
import android.content.Context;

import com.github.nkzawa.emitter.Emitter;

import org.json.JSONException;
import org.json.JSONObject;

public class NewValueEvent implements Emitter.Listener {

    public static final String NAME = "newValue";
    private Notifier notifier;
    private NDCGenerator ndcGenerator;

    public NewValueEvent(Notifier notifier) {
        this.notifier = notifier;
    }

    @Override
    public void call(Object... args) {
        try {
            String name = ((JSONObject) args[0]).getString("device");
            double value = ((JSONObject) args[0]).getDouble("value");
            double nextNDC = ndcGenerator.getNextNDC(name, value);

            if (nextNDC < 60.0) {
                notifier.showNotification(nextNDC, "Please, authenticate yourself again!");
                notifier.lockScreen();
            } else {
                notifier.showNotification(nextNDC, "It's seems you own this device");
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}
