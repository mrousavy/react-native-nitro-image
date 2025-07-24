//
//  PHImageContentMode+AspectFit.swift
//  Pods
//
//  Created by bgl gwyng on 7/17/25.
//

import Photos

extension PHImageContentMode {
  init(aspectFit: AspectFit?) {
    switch aspectFit {
    case .fill: self = .aspectFill
    case .fit: self = .aspectFit
    default: self = .default
    }
  }
}
