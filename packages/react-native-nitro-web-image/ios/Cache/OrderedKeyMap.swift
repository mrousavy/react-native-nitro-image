//
//  OrderedKeyMap.swift
//  NitroWebImage
//

import Foundation

/// Order-preserving map used as the LRU list within a single priority bucket.
/// Head = LRU, tail = MRU.
final class OrderedKeyMap<Key: Hashable, Value> {
  private final class Node {
    let key: Key
    var value: Value
    var prev: Node?
    var next: Node?
    init(key: Key, value: Value) {
      self.key = key
      self.value = value
    }
  }

  private var head: Node?
  private var tail: Node?
  private var nodes: [Key: Node] = [:]

  var isEmpty: Bool { nodes.isEmpty }

  func append(_ key: Key, value: Value) {
    let node = Node(key: key, value: value)
    nodes[key] = node
    linkAtTail(node)
  }

  func moveToTail(_ key: Key) -> Value? {
    guard let node = nodes[key] else { return nil }
    unlink(node)
    linkAtTail(node)
    return node.value
  }

  @discardableResult
  func remove(_ key: Key) -> Value? {
    guard let node = nodes.removeValue(forKey: key) else { return nil }
    unlink(node)
    return node.value
  }

  func popHead() -> (Key, Value)? {
    guard let node = head else { return nil }
    unlink(node)
    nodes.removeValue(forKey: node.key)
    return (node.key, node.value)
  }

  private func linkAtTail(_ node: Node) {
    node.prev = tail
    node.next = nil
    tail?.next = node
    tail = node
    if head == nil { head = node }
  }

  private func unlink(_ node: Node) {
    let prev = node.prev
    let next = node.next
    prev?.next = next
    next?.prev = prev
    if head === node { head = next }
    if tail === node { tail = prev }
    node.prev = nil
    node.next = nil
  }
}
