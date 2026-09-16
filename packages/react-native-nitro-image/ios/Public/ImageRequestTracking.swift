//
//  ImageRequestTracking.swift
//  Pods
//
//  Created by Marc Rousavy on 20.08.26.
//

/**
 * A protocol for image views that can track which image request is currently relevant.
 *
 * Image loading is asynchronous, and a view can be recycled - or asked to load a
 * different image - while a load is still in flight. Without tracking, the stale load
 * would resolve later and overwrite whatever the view is supposed to show now.
 *
 * Views conforming to this protocol get such stale results discarded.
 * `NativeImageView`s that don't conform still work, they just can't cancel.
 */
public protocol ImageRequestTracking: AnyObject {
  /**
   * Starts a new image request and returns a token identifying it.
   * Any previously started request for this view is invalidated.
   */
  func beginImageRequest() -> Int

  /**
   * Invalidates the currently pending image request (if any), without starting a new one.
   */
  func cancelImageRequest()

  /**
   * Whether `token` still identifies this view's most recently started request.
   */
  func isImageRequestValid(_ token: Int) -> Bool
}
