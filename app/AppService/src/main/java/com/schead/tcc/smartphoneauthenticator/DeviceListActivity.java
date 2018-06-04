package com.schead.tcc.smartphoneauthenticator;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.MenuItem;
import android.widget.ListView;

import java.util.ArrayList;
import java.util.List;

public class DeviceListActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_device_list);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setDisplayShowHomeEnabled(true);

        DeviceArrayAdapter adapter = new DeviceArrayAdapter(this, getModel());
        ListView listView = (ListView) findViewById(R.id.list_device);
        listView.setAdapter(adapter);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // handle arrow click here
        if (item.getItemId() == android.R.id.home) {
            finish(); // close this activity and return to preview activity (if there is any)
        }

        return super.onOptionsItemSelected(item);
    }

    private List<Device> getModel() {
        List<Device> list = new ArrayList<Device>();
        list.add(get("device_001"));
        list.add(get("device_002"));
        list.add(get("device_003"));
        // Initially select one of the items
        list.get(1).setSelected(true);
        return list;
    }

    private Device get(String s) {
        return new Device(s);
    }
}
