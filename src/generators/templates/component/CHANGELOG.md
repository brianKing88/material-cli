---
order: 2
title: 更新日志
timeline: true
tag: vVERSION
---
 
`tuhu` 遵循 [Semantic Versioning 2.0.0](http://semver.org/lang/zh-CN/) 语义化版本规范。
 
#### 发布周期
 
- 修订版本号：每周末会进行日常 bugfix 更新。（如果有紧急的 bugfix，则任何时候都可发布）
- 次版本号：每月发布一个带有新特性的向下兼容的版本。
- 主版本号：含有破坏性更新和新特性，不在发布周期内。
 
---
 
## 5.23.2
 
`2025-01-20`
 
- 修复 Radio.Group 最后一项多余 margin 的问题。[#52433](https://github.com/ant-design/ant-design/pull/52433)
- 修复 Input 紧凑模式中 `addonAfter` 的圆角问题。[#52490](https://github.com/ant-design/ant-design/pull/52490) [@DDDDD12138](https://github.com/DDDDD12138)
- TypeScript
  - MISC: 优化 PurePanel 使用 React.ComponentType 类型。[#52480](https://github.com/ant-design/ant-design/pull/52480)
  - 修复 Skeleton 和 Rate 缺失的 token 类型。[#52406](https://github.com/ant-design/ant-design/pull/52406) [@coding-ice](https://github.com/coding-ice)