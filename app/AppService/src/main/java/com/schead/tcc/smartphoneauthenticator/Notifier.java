package com.schead.tcc.smartphoneauthenticator;

import android.app.NotificationManager;
import android.app.admin.DevicePolicyManager;
import android.content.Context;
import android.support.v4.app.NotificationCompat;

public class Notifier {

    private Context context;

    public Notifier(Context context) {
        this.context = context;
    }

    public void showNotification(double value, String message) {
        NotificationCompat.Builder mBuilder =
                new NotificationCompat.Builder(this.context, "0")
                        .setSmallIcon(R.drawable.lock)
                        .setContentTitle("Last NDC: " + value)
                        .setContentText(message)
                        .setOngoing(true);

        // Creates an explicit intent for an Activity in your app
        NotificationManager mNotificationManager =
                (NotificationManager) this.context.getSystemService(Context.NOTIFICATION_SERVICE);

        // mId allows you to update the notification later on.
        mNotificationManager.notify(1, mBuilder.build());
    }

    public void lockScreen() {
        DevicePolicyManager mDP = (DevicePolicyManager) context.getSystemService(Context.DEVICE_POLICY_SERVICE);
        mDP.lockNow();
    }

}
