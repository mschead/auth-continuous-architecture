package com.schead.tcc.smartphoneauthenticator;

import java.util.HashMap;
import java.util.Map;

public class NDCGenerator {

    private Map<String, Double> pesos = new HashMap<>();
    private Double currentNDC = 100.00;

    public NDCGenerator() {
        pesos.put("device_001", 1.0);
    }

    public double getNextNDC(String senderDevice, double senderValue) {
        double outrosPesos = pesos.keySet().size() == 1 ? 1.0 : 0.0;
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

}
