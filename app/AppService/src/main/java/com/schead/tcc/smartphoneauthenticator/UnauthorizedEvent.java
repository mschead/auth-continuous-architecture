package com.schead.tcc.smartphoneauthenticator;

import com.github.nkzawa.emitter.Emitter;

public class UnauthorizedEvent implements Emitter.Listener {

    public static final String NAME = "unauthorized";

    @Override
    public void call(Object... args) {
        System.out.print("Wrong credentials");
    }
}
