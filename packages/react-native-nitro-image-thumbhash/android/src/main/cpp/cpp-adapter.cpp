#include <jni.h>
#include <fbjni/fbjni.h>
#include "NitroImageThumbHashOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return facebook::jni::initialize(vm, []() {
    margelo::nitro::image::thumbhash::registerAllNatives();
  });
}
