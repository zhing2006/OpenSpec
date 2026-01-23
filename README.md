<p align="center">
  <a href="https://github.com/zhing2006/OpenGameDesign">
    <h1 align="center">OGD</h1>
  </a>
</p>
<p align="center">游戏设计规范驱动开发工具</p>
<p align="center">
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" /></a>
</p>

# OpenGameDesign (OGD)

OGD 是一个面向游戏设计师的规范驱动开发工具，从 [OGD](https://github.com/zhing2006/OpenGameDesign) 分叉而来。它帮助人类和 AI 编码助手在编写代码之前就规范达成一致。

## 为什么使用 OGD？

AI 编码助手功能强大，但当需求只存在于聊天历史中时，结果往往不可预测。OGD 添加了一个轻量级的规范工作流，在实现之前锁定意图，为你提供确定性的、可审查的输出。

核心价值：
- 人类和 AI 在工作开始前就规范达成一致
- 结构化的变更文件夹（提案、任务和规范更新）使范围明确且可审计
- 共享可见性：可以查看哪些内容被提议、正在进行或已归档
- 与你已使用的 AI 工具兼容：支持自定义斜杠命令的工具可使用原生命令，其他工具使用上下文规则

## 游戏设计专属功能

- **设计支柱系统** - 定义核心设计原则，所有功能规范必须与之对齐
- **双类型规范** - 全局规范 (game-vision) + 功能规范 (feature specs)
- **中文模板** - 所有模板均为中文，适合中文游戏设计团队
- **设计产物类型** - 支持 gameplay-design.md, numerical-framework.md 等设计产物

## 工作流程

```
┌────────────────────┐
│ 起草变更提案       │
│                    │
└────────┬───────────┘
         │ 与 AI 分享意图
         ▼
┌────────────────────┐
│ 审查与对齐         │◀──── 反馈循环 ──────┐
│ (编辑规范/任务)    │                      │
└────────┬───────────┘                      │
         │ 批准的方案                       │
         ▼                                  │
┌────────────────────┐                      │
│ 实现任务           │──────────────────────┘
│ (AI 编写代码)      │
└────────┬───────────┘
         │ 交付变更
         ▼
┌────────────────────┐
│ 归档并更新规范     │
│ (源文件)           │
└────────────────────┘

1. 起草一个捕获你想要的规范更新的变更提案
2. 与 AI 助手一起审查提案，直到达成一致
3. 实现引用已同意规范的任务
4. 归档变更，将批准的更新合并回源规范
```

## 快速开始

### 安装

```bash
npm install -g @game-design/ogd
# 或
pnpm add -g @game-design/ogd
```

### 初始化项目

```bash
cd your-game-project
ogd init
```

这将创建 `ogd/` 目录结构：

```
ogd/
├── AGENTS.md           # AI 助手指南
├── pillars.md          # 设计支柱
├── specs/              # 当前规范（已构建的内容）
│   └── [capability]/
│       └── spec.md
└── changes/            # 变更提案（计划中的内容）
    ├── [change-name]/
    │   ├── proposal.md
    │   ├── tasks.md
    │   └── specs/
    └── archive/
```

### 核心命令

```bash
# 查看活跃变更
ogd list

# 查看规范列表
ogd list --specs

# 显示变更或规范详情
ogd show <item>

# 验证变更或规范
ogd validate <item> --strict

# 归档已完成的变更
ogd archive <change-id>
```

## 支持的 AI 工具

| 工具 | 支持方式 |
|------|----------|
| Amazon Q Developer | 自定义提示 |
| Claude Code | Agent Skills |
| Cursor | 规则文件 |
| GitHub Copilot | 自定义指令 |
| Windsurf | 规则文件 |
| 更多... | 参见 `ogd init` |

## 目录结构

```
ogd/
├── config.yaml           # 项目配置
├── project.md            # 项目约定
├── AGENTS.md             # AI 指导
├── specs/                # 已定稿的设计规范
│   └── game-vision/      # 全局规范（游戏愿景）
│       └── spec.md
└── changes/              # 设计变更
    ├── add-combat-system/
    │   ├── proposal.md
    │   ├── design.md
    │   ├── tasks.md
    │   └── specs/
    │       └── combat-system/
    │           └── spec.md
    └── archive/
```

## Schema 系统

OGD 使用 Schema 定义工作流程。默认使用 `spec-driven` Schema。

查看可用 Schema：
```bash
ogd schemas
```

使用自定义 Schema 创建变更：
```bash
ogd new change my-feature --schema game-design
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License - 参见 [LICENSE](LICENSE) 文件。

## 致谢

本项目基于 [OGD](https://github.com/zhing2006/OpenGameDesign) 开发，感谢 Fission AI 团队的出色工作。
