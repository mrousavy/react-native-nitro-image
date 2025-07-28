#include <jni.h>
#include "NitroWebImageOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::web::image::initialize(vm);
}
