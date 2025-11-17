def fix_svgkit(installer)
  puts "🔧 Fixing SVGKit Node.h conflicts..."

  svgkit_pod = installer.pods_project.targets.find { |target| target.name == 'SVGKit' }

  if svgkit_pod.nil?
    puts "⚠️  SVGKit pod not found, skipping fix"
    return
  end

  # Get SVGKit path
  svgkit_path = installer.sandbox.pod_dir('SVGKit')

  unless svgkit_path && Dir.exist?(svgkit_path)
    puts "⚠️  SVGKit directory not found at #{svgkit_path}"
    return
  end

  fixed_count = 0

  # Fix all .h, .m, and .mm files
  Dir.glob("#{svgkit_path}/**/*.{h,m,mm}").each do |file|
    content = File.read(file)

    # Replace #import "Node.h" with #import "SVGKit/Node.h"
    new_content = content.gsub(/#import\s+"Node\.h"/, '#import "SVGKit/Node.h"')

    if content != new_content
      File.write(file, new_content)
      fixed_count += 1
    end
  end

  if fixed_count > 0
    puts "✅ Fixed #{fixed_count} file(s) in SVGKit"
  else
    puts "ℹ️  No Node.h imports found in SVGKit (might already be fixed)"
  end
end
