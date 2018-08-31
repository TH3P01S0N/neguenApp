package com.nativestarterkit;

import com.facebook.react.ReactActivity;
import android.content.Intent;

import android.net.Uri;
import android.provider.Settings;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    public static final int PERMISSION_REQ_CODE = 1234; //1
    public static final int OVERLAY_PERMISSION_REQ_CODE = 1235; //1

    String[] perms = { //1
        "android.permission.ACCESS_FINE_LOCATION", 
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.CAMERA"
    };

    @Override
    protected String getMainComponentName() {
        return "NativeStarterKit";
    }
    @Override
    public void onCreate (Bundle savedInstanceState) {  //1
        super.onCreate(savedInstanceState);
        // Checking permissions on init
        checkPerms();
    }


    public void checkPerms() { //1
        // Checking if device version > 22 and we need to use new permission model 
        if(Build.VERSION.SDK_INT>Build.VERSION_CODES.LOLLIPOP_MR1) {
            // Checking if we can draw window overlay
            if (!Settings.canDrawOverlays(this)) {
                // Requesting permission for window overlay(needed for all react-native apps)
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                  Uri.parse("package:" + getPackageName()));
                startActivityForResult(intent, OVERLAY_PERMISSION_REQ_CODE);
            }
            for(String perm : perms){
                // Checking each persmission and if denied then requesting permissions
                if(checkSelfPermission(perm) == PackageManager.PERMISSION_DENIED){
                    requestPermissions(perms, PERMISSION_REQ_CODE);
                    break;
                }
            }
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
        if (requestCode == OVERLAY_PERMISSION_REQ_CODE) { //1
          checkPerms();
      }
    }

    // Permission results
    @Override  //1
    public void onRequestPermissionsResult(int permsRequestCode, String[] permissions, int[] grantResults){
        switch(permsRequestCode){
            case PERMISSION_REQ_CODE:
                // example how to get result of permissions requests (there can be more then one permission dialog)
                // boolean readAccepted = grantResults[0]==PackageManager.PERMISSION_GRANTED;
                // boolean writeAccepted = grantResults[1]==PackageManager.PERMISSION_GRANTED;
                // checking permissions to prevent situation when user denied some permission
                checkPerms();
                break;

        }
    }
}
