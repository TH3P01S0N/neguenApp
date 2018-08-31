package com.nativestarterkit;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.bhavan.RNNavBarColor.RNNavBarColor;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.microsoft.codepush.react.CodePush;
import com.airbnb.android.react.maps.MapsPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;


import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;

import com.imagepicker.ImagePickerPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }
  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }


   
	
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNNavBarColor(),
            new VectorIconsPackage(),
            new FBSDKPackage(mCallbackManager),
            new CodePush(null, getApplicationContext(), BuildConfig.DEBUG),
            new MapsPackage(),
            new RNFusedLocationPackage(),
            new ImagePickerPackage(),
            new RNGeocoderPackage()

      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    AppEventsLogger.activateApp(this);
  }
}
