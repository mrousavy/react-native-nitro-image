package com.margelo.nitro.web.image;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.TurboReactPackage;
import com.facebook.react.uimanager.ViewManager;
import com.margelo.nitro.core.HybridObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.function.Supplier;

public class NitroWebImagePackage extends TurboReactPackage {
  @Nullable
  @Override
  public NativeModule getModule(String name, ReactApplicationContext reactContext) {
    return null;
  }

  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return () -> {
        return new HashMap<>();
    };
  }


  @Override
  public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
    List<ViewManager> viewManagers = new ArrayList<>();
    return viewManagers;
  }

  static {
    NitroWebImageOnLoad.initializeNative();
  }
}
