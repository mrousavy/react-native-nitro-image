#include <jni.h>
#include "NitroSVGImageOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::svg::image::initialize(vm);
}
