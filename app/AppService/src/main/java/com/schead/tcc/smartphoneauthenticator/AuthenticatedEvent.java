package com.schead.tcc.smartphoneauthenticator;

import android.content.Context;

import com.github.nkzawa.emitter.Emitter;

public class AuthenticatedEvent implements Emitter.Listener {

    public static final String NAME = "authenticated";
    private Notifier notifier;

    public AuthenticatedEvent(Notifier notifier) {
        this.notifier = notifier;
    }

    @Override
    public void call(Object... args) {
        notifier.showNotification(100, "It's seems you own this device");
    }
}
