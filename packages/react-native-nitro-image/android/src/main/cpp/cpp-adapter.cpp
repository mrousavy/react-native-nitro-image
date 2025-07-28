#include <jni.h>
#include "NitroImageOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::image::initialize(vm);
}
