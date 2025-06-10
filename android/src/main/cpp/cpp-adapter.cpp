#include <jni.h>
#include "NitroImageOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::nitroimage::initialize(vm);
}
