<a href="https://margelo.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./img/banner-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="./img/banner-light.png" />
    <img alt="react-native-nitro-image" src="./img/banner-light.png" />
  </picture>
</a>

<br />

**Nitro Image** is a superfast Image core type and view component for React Native, built with Nitro!

- Powered by [Nitro Modules](https://nitro.margelo.com) for highly efficient native bindings! 🔥
- Instance-based `Image` type with byte-buffer pixel data access 🔗
- Supports in-memory image operations like resizing and cropping without saving to file 📐
- Supports deferred `ImageLoader` types to optimize for displaying large lists of Images ⏳
- Fast Web Image loading and caching using [SDWebImage](https://github.com/SDWebImage/SDWebImage) (iOS) and [Coil](https://github.com/coil-kt/coil) (Android) 🌎
- [ThumbHash](https://github.com/evanw/thumbhash) support for elegant placeholders 🖼️

```tsx
function App() {
  return (
    <NitroImage
      image={{ filePath: '/tmp/image.jpg' }}
      style={{ width: 400, height: 400 }}
    />
  )
}
```

## Installation

Install [react-native-nitro-image](https://www.npmjs.com/package/react-native-nitro-image) from npm:

```sh
npm i react-native-nitro-image
npm i react-native-nitro-modules
cd ios && pod install
```

> [!NOTE]
> Since NitroImage is built with [Nitro Views](https://nitro.margelo.com/docs/hybrid-views), it requires the [new architecture](https://reactnative.dev/architecture/landing-page) to be enabled.

### Web Images

To keep NitroImage super lightweight, it does not ship a web image loader and caching system.
If you want to load images from the web, install [react-native-nitro-web-image](https://www.npmjs.com/package/react-native-nitro-web-image) as well:

```sh
npm i react-native-nitro-web-image
cd ios && pod install
```

Then, since [SDWebImage does not enable modular headers](https://github.com/SDWebImage/SDWebImage?tab=readme-ov-file#swift-and-static-framework) for static linkage, you need to enable those yourself **in your app's `Podfile`**:

```rb
target '…' do
  config = use_native_modules!

  # Add this line:
  pod 'SDWebImage', :modular_headers => true
```

## Usage

### Creating `Image`s

The simplest way to load an Image is to use the exported `loadImage(…)` method:

```ts
const webImage      = await loadImage({ url: 'https://picsum.photos/seed/123/400' })
const fileImage     = await loadImage({ filePath: 'file://my-image.jpg' })
const resourceImage = await loadImage({ resource: 'my-image.jpg' })
const symbolImage   = await loadImage({ symbol: 'star' })
const requireImage  = await loadImage(require('./my-image.jpg'))
```

Under the hood, this uses the native methods from `Images` or `WebImages`:

```ts
const webImage      = await WebImages.loadFromURLAsync('https://picsum.photos/seed/123/400')
const fileImage     = await Images.loadFromFileAsync('file://my-image.jpg')
const resourceImage = Images.loadFromResources('my-resource.jpg')
const symbolImage   = Images.loadFromSymbol('star')
```

#### Load with Options

When loading from a remote URL, you can tweak options such as `priority`:

```ts
const image1 = await WebImages.loadFromURLAsync(URL1, { priority: 'low' })
const image2 = await WebImages.loadFromURLAsync(URL2, { priority: 'high' })
```

#### Preloading

If you know what Images are going to be rendered soon, you can pre-load them using the `preload(...)` API:

```ts
WebImages.preload(profilePictureLargeUrl)
```

#### `require(…)`

A React Native `require(…)` returns a resource-ID. In debug, resources are streamed over Metro (`localhost://…`), while in release, they are embedded in the resources bundle.
NitroImage wraps those APIs so you can just pass a `require(…)` to `useImage(…)`, `useImageLoader(…)`, or `<NitroImage />` directly:

```ts
const image = useImage(require('./image.png'))
```

#### `ArrayBuffer`

The `Image` type can be converted to- and from- an `ArrayBuffer`, which gives you access to the raw pixel data in an RGB format:

```ts
const image           = // ...
const pixelData       = await image.toRawPixelData()
const sameImageCopied = await Images.loadFromRawPixelData(pixelData)
```

#### `EncodedImageData`

The `Image` type can be encoded to- and decoded from- an `ArrayBuffer` using a container format like `jpg`, `png` or `heic`:

```ts
const image           = // ...
const imageData       = await image.toEncodedImageData('jpg', 90)
const sameImageCopied = await Images.loadFromEncodedImageData(imageData)
```

#### Resizing

An `Image` can be resized entirely in-memory, without ever writing to- or reading from- a file:

```ts
const webImage = await WebImages.loadFromURLAsync('https://picsum.photos/seed/123/400')
const smaller  = await webImage.resizeAsync(200, 200)
```

#### Cropping

An `Image` can be cropped entirely in-memory, without ever writing to- or reading from- a file:

```ts
const webImage = await WebImages.loadFromURLAsync('https://picsum.photos/seed/123/400')
const smaller  = await webImage.cropAsync(100, 100, 50, 50)
```

#### Saving

An in-memory `Image` object can also be written/saved to a file:

```ts
const image  = ...
const path   = await image.saveToTemporaryFileAsync('jpg', 90)
```

#### Compressing

Images can be compressed using the `jpg` container format - either in-memory or when writing to a file:

```ts
const image      = ...
const path       = await image.saveToTemporaryFileAsync('jpg', 50) // 50% compression
const compressed = await image.toEncodedImageData('jpg', 50)       // 50% compression
```

#### HEIC/HEIF

NitroImage supports `HEIC`/`HEIF` format if the host OS natively supports it.

|              | iOS            | Android        |
|--------------|----------------|----------------|
| Loading HEIC | ✅             | ✅ (>= SDK 28) |
| Writing HEIC | ✅ (>= iOS 17) | ❌             |

### Hooks

#### The `useImage()` hook

The `useImage()` hook asynchronously loads an `Image` from the given source and returns it as a React state:

```tsx
function App() {
  const image = useImage({ filePath: '/tmp/image.jpg' })
  return …
}
```

#### The `useImageLoader()` hook

The `useImageLoader()` hook creates an asynchronous `ImageLoader` which can be passed to a `<NitroImage />` view to defer image loading:

```tsx
function App() {
  const loader = useImageLoader({ filePath: '/tmp/image.jpg' })
  return (
    <NitroImage
      image={loader}
      style={{ width: 400, height: 400 }}
    />
  )
}
```

### The `<NitroImage />` view

The `<NitroImage />` view is a React Native view that allows you to render `Image` - either asynchronously (by wrapping `ImageLoader`s), or synchronously (by passing `Image` instances directly):

```tsx
function App() {
  return (
    <NitroImage
      image={{ filePath: '/tmp/image.jpg' }}
      style={{ width: 400, height: 400 }}
    />
  )
}
```

### The `<NativeNitroImage />` view

The `<NativeNitroImage />` view is the actual native Nitro View component for rendering an `Image` instance. It is recommended to use abstractions like [`<NitroImage />`](#the-nitroimage--view) instead of the actual native component. However if you need to use the native component instead, it is still exposed:

```tsx
function App() {
  const image = …
  return (
    <NativeNitroImage
      image={image}
      style={{ width: 400, height: 400 }}
    />
  )
}
```

#### Dynamic width or height

To achieve a dynamic width or height calculation, you can use the `image`'s dimensions:

```tsx
function App() {
  const { image, error } = useImage({ filePath: '/tmp/image.jpg' })
  const aspect = (image?.width ?? 1) / (image?.height ?? 1)
  return (
    <NitroImage
      image={image}
      style={{ width: '100%', aspectRatio: aspect }}
    />
  )
}
```

This will now resize the `height` dimension to match the same aspect ratio as the `image` - in this case it will be 1:1 since the image is 400x400.

If the `image` is 400x200, the `height` of the view will be **half** of the `width` of the view, i.e. a 0.5 aspect ratio.

### ThumbHash

A ThumbHash is a short binary (or base64 string) representation of a blurry image.
Since it is a very small buffer (or base64 string), it can be added to a payload (like a `user` object in your database) to immediately display an image placeholder while the actual image loads.

<details>
  <summary>Usage Example</summary>


  For example, your `users` database could have a `users.profile_picture_url` field which you use to asynchronously load the web Image, and a `users.profile_picture_thumbhash` field which contains the ThumbHash buffer (or base64 string) which you can display on-device immediately.

  - `users`
    - `users.profile_picture_url`: Load asynchronously
    - `users.profile_picture_thumbhash`: Decode & Display immediately

  Everytime you upload a new profile picture for the user, you should encode the image to a new ThumbHash again and update the `users.profile_picture_thumbhash` field. This should ideally happen on your backend, but can also be performed on-device if needed.
</details>

#### ThumbHash (`ArrayBuffer`) <> Image

NitroImage supports conversion from- and to- [ThumbHash](https://github.com/evanw/thumbhash) representations out of the box.

For performance reasons, a ThumbHash is represented as an `ArrayBuffer`.

```ts
const thumbHash      = // from server
const image          = Images.loadFromThumbHash(thumbHash)
const thumbHashAgain = image.toThumbHash()
```

##### ThumbHash (`ArrayBuffer`) <> Base64 String

If your ThumbHash is a `string`, convert it to an `ArrayBuffer` first, since this is more efficient:

```ts
const thumbHashBase64      = // from server
const thumbHashArrayBuffer = thumbHashFromBase64String(thumbHashBase64)
const thumbHashBase64Again = thumbHashToBase64String(thumbHashArrayBuffer)
```

##### Async ThumbHash

Since ThumbHash decoding or encoding can be a slow process, you should consider using the async methods instead:

```ts
const thumbHash      = // from server
const image          = await Images.loadFromThumbHashAsync(thumbHash)
const thumbHashAgain = await image.toThumbHash()
```

## Using the native `Image` type in a third-party library

To use the native `Image` type in your library (e.g. in a Camera library), you need to follow these steps:

1. Add the dependency on `react-native-nitro-image`
    - JS: Add `react-native-nitro-image` to `peerDependencies` and `devDependencies`
    - Android: Add `:react-native-nitro-image` to your `build.gradle`'s `dependencies`, and `react-native-nitro-image::NitroImage` to your CMake's dependencies (it's a prefab)
    - iOS: Add `NitroImage` to your `*.podspec`'s dependencies
2. In your Nitro specs (`*.nitro.ts`), just import `Image` from `'react-native-nitro-image'` and use it as a type
3. In your native implementation, you can either;
    - Implement `HybridImageSpec`, `HybridImageLoaderSpec` or `HybridImageViewSpec` with your custom implementation, e.g. to create a `Image` implementation that doesn't use `UIImage` but instead uses `CGImage`, or an `AVPhoto`
    - Use the `HybridImageSpec`, `HybridImageLoaderSpec` or `HybridImageViewSpec` types. You can either use them abstract (with all the methods that are also exposed to JS), or by downcasting them to a specific type - all of them follow a protocol like `NativeImage`:
      ```swift
      class HybridCustom: HybridCustomSpec {
        func doSomething(image: any HybridImageSpec) throws {
          guard let image = image as? NativeImage else { return }
          let uiImage = image.uiImage
          // ...
        }
      }
      ```
4. Done! 🎉 Now you can benefit from a common, shared `Image` type - e.g. your Camera library can directly return an `Image` instance in `takePhoto()`, which can be instantly rendered using `<NitroImage />` - no more file I/O!
