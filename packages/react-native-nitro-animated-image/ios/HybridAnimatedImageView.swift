import Foundation
import NitroModules
import SDWebImage
import SDWebImageWebPCoder
import UIKit

class HybridAnimatedImageView: HybridNitroAnimatedImageViewSpec {
    //needed to support loading WebP images
    private static let registerCoders: Void = {
        SDImageCodersManager.shared.addCoder(SDImageWebPCoder.shared)
    }()

    let view = AnimatedImageView()
    private var resetImageBeforeLoad = false

    override init() {
        _ = Self.registerCoders
        super.init()
        view.delegate = self
    }

    var resizeMode: ResizeMode? {
        didSet {
            DispatchQueue.runOnMain {
                self.updateResizeMode()
            }
        }
    }
    var image: String? = nil {
        didSet {
            DispatchQueue.runOnMain {
                self.updateImage()
            }
        }
    }
    var recyclingKey: String? {
        didSet {
            resetImageBeforeLoad = recyclingKey != oldValue
        }
    }
    var autoplay: Bool? {
        didSet {
            DispatchQueue.runOnMain {
                self.view.autoPlayAnimatedImage = self.autoplay ?? true
            }
        }
    }

    func startAnimating() throws {
        DispatchQueue.runOnMain {
            self.view.startAnimating()
        }
    }

    func stopAnimating() throws {
        DispatchQueue.runOnMain {
            self.view.stopAnimating()
        }
    }

    private func updateResizeMode() {
        let mode = resizeMode ?? .cover
        switch mode {
        case .cover:
            view.contentMode = .scaleAspectFill
        case .contain:
            view.contentMode = .scaleAspectFit
        case .stretch:
            view.contentMode = .scaleToFill
        case .center:
            view.contentMode = .center
        }
    }

    private func updateImage() {
        if view.isVisible {
            loadImage()
        } else {
            dropImage()
        }
    }

    private func loadImage() {
        guard let image, let imageURL = URL(string: image) else {
            view.image = nil
            return
        }
        if resetImageBeforeLoad {
            view.image = nil
            resetImageBeforeLoad = false
        }
        var context: [SDWebImageContextOption: Any] = [:]
        context[.animatedImageClass] = SDAnimatedImage.self
        view.sd_setImage(
            with: imageURL,
            placeholderImage: view.image,
            options: [],
            context: context)
    }

    private func dropImage() {
        view.sd_cancelCurrentImageLoad()
    }
}

extension HybridAnimatedImageView: AnimatedViewLifecycleDelegate {
    func willShow() {
        loadImage()
    }

    func willHide() {
        dropImage()
    }
}

extension HybridAnimatedImageView: RecyclableView {
    func prepareForRecycle() {
        dropImage()
        view.image = nil
    }
}
