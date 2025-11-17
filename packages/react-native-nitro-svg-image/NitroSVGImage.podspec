require "json"
package = JSON.parse(File.read(File.join(__dir__, "package.json")))
Pod::Spec.new do |s|
  s.name         = "NitroSVGImage"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]
  s.platforms    = { :ios => min_ios_version_supported, :visionos => 1.0 }
  s.source       = { :git => "https://github.com/mrousavy/nitro.git", :tag => "#{s.version}" }
  s.source_files = [
    # Implementation (Swift)
    "ios/**/*.{swift}",
    # Autolinking/Registration (Objective-C++)
    "ios/**/*.{m,mm}",
    # Implementation (C++ objects)
    "cpp/**/*.{hpp,cpp}",
  ]

  # Fix SVGKit's Node.h conflict
  s.script_phases = [
    {
      :name => 'Fix SVGKit Node.h imports',
      :script => 'SVGKIT_PATH="${PODS_ROOT}/SVGKit"; if [ -d "$SVGKIT_PATH" ]; then find "$SVGKIT_PATH" -type f \( -name "*.h" -o -name "*.m" -o -name "*.mm" \) -exec sed -i "" "s/#import \"Node\\.h\"/#import \"SVGKit\\/Node.h\"/g" {} +; echo "Fixed SVGKit Node.h imports"; fi',
      :execution_position => :before_compile
    }
  ]

  load 'nitrogen/generated/ios/NitroSVGImage+autolinking.rb'
  add_nitrogen_files(s)
  s.dependency 'React-jsi'
  s.dependency 'React-callinvoker'
  s.dependency 'CocoaLumberjack'
  s.dependency 'SVGKit'
  s.dependency 'NitroImage'
  install_modules_dependencies(s)
end
