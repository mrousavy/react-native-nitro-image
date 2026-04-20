#include <jni.h>
#include <fbjni/fbjni.h>
#include "NitroAnimatedImageOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return facebook::jni::initialize(vm, []() {
    margelo::nitro::animated::image::registerAllNatives();
  });
}
