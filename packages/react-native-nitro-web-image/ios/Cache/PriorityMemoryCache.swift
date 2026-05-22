//
//  PriorityMemoryCache.swift
//  NitroWebImage
//

import Foundation
import SDWebImage
import UIKit


final class PriorityMemoryCache: NSObject, SDMemoryCacheProtocol {
  static let cachePriorityExtra = "cachePriority"
  static let prioritySeparator: Character = "|"

  private static let bucketCount = 3
  private static let defaultPriority = 1

  private let lock = NSLock()
  private var buckets: [OrderedKeyMap<NSString, InternalValue>] =
    (0..<bucketCount).map { _ in OrderedKeyMap() }
  private var keyToBucket: [NSString: Int] = [:]
  private var currentBytes: UInt = 0
  private let _config: SDImageCacheConfig
  private var memoryWarningObserver: NSObjectProtocol?

  var config: SDImageCacheConfig { _config }

  init(config: SDImageCacheConfig) {
    self._config = config
    super.init()
    // when iOS warns about memory pressure, halve the cache (priority-aware via trimToSizeLocked)
    memoryWarningObserver = NotificationCenter.default.addObserver(
      forName: UIApplication.didReceiveMemoryWarningNotification,
      object: nil,
      queue: nil,
    ) { [weak self] _ in
      guard let self = self else { return }

      self.trimToSizeLocked(UInt(self._config.maxMemoryCost) / 2)
    }
  }

  deinit {
    if let observer = memoryWarningObserver {
      NotificationCenter.default.removeObserver(observer)
    }
  }

  // MARK: - SDMemoryCache

  func object(forKey key: Any) -> Any? {
    guard let key = key as? NSString else { return nil }
    lock.lock()
    defer { lock.unlock() }

    guard let bucketIndex = keyToBucket[key] else { return nil }
    return buckets[bucketIndex].moveToTail(key)?.object
  }

  func setObject(_ object: Any?, forKey key: Any) {
    setObject(object, forKey: key, cost: 0)
  }

  func setObject(_ object: Any?, forKey key: Any, cost: UInt) {
    guard let key = key as? NSString else { return }
    lock.lock()
    defer { lock.unlock() }

    // Replace any prior entry under this key.
    removeLocked(key)

    guard let object = object else { return }

    let maxBytes = UInt(_config.maxMemoryCost)
    // Refuse oversized entries, would otherwise evict the rest of the cache.
    if maxBytes > 0 && cost > maxBytes { return }

    let priority = Self.parsePriority(key)
    buckets[priority].append(key, value: InternalValue(object: object, cost: cost))
    keyToBucket[key] = priority
    currentBytes &+= cost

    if maxBytes > 0 { trimToSizeLocked(maxBytes) }
  }

  func removeObject(forKey key: Any) {
    guard let key = key as? NSString else { return }
    lock.lock()
    defer { lock.unlock() }
    _ = removeLocked(key)
  }

  func removeAllObjects() {
    lock.lock()
    defer { lock.unlock() }
    for index in 0..<buckets.count { buckets[index] = OrderedKeyMap() }
    keyToBucket.removeAll()
    currentBytes = 0
  }

  // MARK: - Internal helpers (caller holds the lock)

  @discardableResult
  private func removeLocked(_ key: NSString) -> Bool {
    guard let bucketIndex = keyToBucket.removeValue(forKey: key) else { return false }
    guard let value = buckets[bucketIndex].remove(key) else { return false }
    currentBytes = currentBytes >= value.cost ? currentBytes - value.cost : 0
    return true
  }

  private func trimToSizeLocked(_ target: UInt) {
    while currentBytes > target {
      if !evictOneLocked() { return }
    }
  }

  private func evictOneLocked() -> Bool {
    for priority in 0..<Self.bucketCount {
      guard let (key, value) = buckets[priority].popHead() else { continue }
      keyToBucket.removeValue(forKey: key)
      currentBytes = currentBytes >= value.cost ? currentBytes - value.cost : 0
      return true
    }
    return false
  }

  private static func parsePriority(_ key: NSString) -> Int {
    let str = key as String
    guard let sepIndex = str.firstIndex(of: prioritySeparator) else { return defaultPriority }
    let prefix = str[str.startIndex..<sepIndex]
    guard let raw = Int(prefix) else { return defaultPriority }
    return max(0, min(bucketCount - 1, raw))
  }

  private struct InternalValue {
    let object: Any
    let cost: UInt
  }
}
