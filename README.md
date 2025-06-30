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
- Support basic in-memory image operations like resizing without saving to file 📐
- Fast Web Image loading and caching using [SDWebImage](https://github.com/SDWebImage/SDWebImage) (iOS) and [Coil](https://github.com/coil-kt/coil) (Android) 🌎

```tsx
function App() {
  const image = useWebImage('https://picsum.photos/seed/123/400')
  return (
    <NitroImage
      image={image}
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

Then, since [SDWebImage does not enable modular headers](https://github.com/SDWebImage/SDWebImage?tab=readme-ov-file#swift-and-static-framework) for static linkage, you need to enable those yourself **in your app's `Podfile`**:

```rb
target '…' do
  config = use_native_modules!

  # Add this line:
  pod 'SDWebImage', :modular_headers => true
```

> Note; if you are on Expo, this is already enabled for you.

## Usage

### Creating `Image`s

There are numerous ways to create an `Image` through the `ImageFactory`:

```ts
const webImage      = await loadImageFromURLAsync('https://picsum.photos/seed/123/400')
const fileImage     = await loadImageFromFileAsync('file://my-image.jpg')
const resourceImage = loadImageFromResources('my-resource.jpg')
const symbolImage   = loadImageFromSymbol('star')
```

#### `ArrayBuffer`

The `Image` type can be converted to- and from- an `ArrayBuffer`:

```ts
const webImage        = await loadImageFromURLAsync('https://picsum.photos/seed/123/400')
const arrayBuffer     = await webImage.toArrayBufferAsync()
const sameImageCopied = await loadImageFromArrayBufferAsync(arrayBuffer)
```

#### Resizing

An `Image` can be resized entirely in-memory, without ever writing to- or reading from- a file:

```ts
const webImage = await loadImageFromURLAsync('https://picsum.photos/seed/123/400')
const smaller  = await webImage.resizeAsync(200, 200)
```

#### Saving

An in-memory `Image` object can also be written/saved to a file:

```ts
const smaller  = ...
const path     = await smaller.saveToTemporaryFileAsync('jpg', 90)
```

### Hooks

#### The `useWebImage()` hook

The `useWebImage()` hook loads an `Image` from a remote URL and returns it as a React state:

```tsx
function App() {
  const image = useWebImage('https://picsum.photos/seed/123/400')
}
```

### The `<NitroImage />` view

The `<NitroImage />` view is a React Native view component for rendering an `Image` instance:

```tsx
function App() {
  const image = useWebImage('https://picsum.photos/seed/123/400')
  return (
    <NitroImage
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
  const image = useWebImage('https://picsum.photos/seed/123/400')
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

