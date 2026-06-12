---
title: 【笔记】Claude Code MCP 使用完全指南（本地 MCP + 远程 MCP）
published: 2026-06-12
description: Claude Code 中 MCP 的安装、配置与使用教程 | 本地 MCP、远程 MCP、OAuth 登录、团队共享全覆盖
image: https://jzzt-resources.oss-cn-hangzhou.aliyuncs.com/obsidian/posts-image/20260612163414049.png
tags:
  - mcp
  - 工具
category: 学习&笔记
draft: false
lang: ""
---

# Claude Code MCP 使用完全指南（本地 MCP + 远程 MCP）

## 什么是 MCP？

MCP（Model Context Protocol）可以理解为给 Claude 增加工具能力的能力：

| 类型 | 能力 |
|------|------|
| Skill | 编码规范、文档模板、工作流 |
| MCP | 浏览器控制、数据库查询、GitHub操作、Sentry排查、Notion查询 |

## MCP 架构原理

```text
Claude Code
      │
      ▼
 MCP Client
      │
 ┌────┴────┐
 │         │
 ▼         ▼
本地MCP    远程MCP
(stdio)   (http)
 │         │
 ▼         ▼
Playwright GitHub
SQLite     Notion
Redis      Sentry
```

| 类型 | 通信方式 | 运行位置 |
|------|----------|----------|
| 本地 MCP | stdio | 本机启动进程 |
| 远程 MCP | HTTP/SSE | 云端服务器 |

## 配置文件位置

Claude Code 有三个作用域：

| Scope | 作用 | 配置文件 |
|-------|------|----------|
| local | 当前项目 | `项目目录/.mcp.json` |
| project | 团队共享 | `项目目录/.mcp.json`（提交到 Git） |
| user | 全局用户 | `~/.claude.json`（Windows: `C:\Users\用户名\.claude.json`） |

## 本地 MCP（stdio）

本地 MCP 由 Claude 启动子进程，通过 stdin/stdout 通信。典型应用：Playwright、SQLite、Redis、PostgreSQL。

### 三种作用域的安装命令

```bash
# local（当前项目，默认）
claude mcp add playwright -- npx -y @playwright/mcp@latest

# project（团队共享，提交到 .mcp.json）
claude mcp add --scope project playwright -- npx -y @playwright/mcp@latest

# user（全局用户）
claude mcp add --scope user playwright -- npx -y @playwright/mcp@latest
```

### 管理命令

```bash
claude mcp list              # 查看所有 MCP
claude mcp get playwright    # 查看详情
claude mcp remove playwright # 删除
```

### 直接编辑 .mcp.json

项目根目录创建：

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

首次启动 Claude 会提示 `Approve MCP Server?`，选择 `Yes` 即可。

### 带环境变量的配置

```json
{
  "mcpServers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "ghp_xxxxxx" }
    }
  }
}
```

## 远程 MCP（HTTP）

远程 MCP 通过 HTTP 连接云端服务器，不在本机运行。典型应用：GitHub MCP、Sentry MCP、Notion MCP、Claude Docs MCP。

### 安装命令

```bash
claude mcp add \
  --transport http \
  claude-code-docs \
  https://code.claude.com/docs/mcp
```

参数说明：`--transport http` 指定 HTTP 模式，后跟服务器名称和 URL。

### 直接写配置

```json
{
  "mcpServers": {
    "claude-code-docs": {
      "type": "http",
      "url": "https://code.claude.com/docs/mcp"
    }
  }
}
```

### 测试

```
Use claude-code-docs server to explain MCP_TIMEOUT
```

Claude 会自动调用 `claude-code-docs.search_docs`。

## OAuth 登录型 MCP

以 Sentry 为例：

```bash
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```

安装后状态为 `! Needs authentication`。在 Claude 中输入 `/mcp`，选择 `sentry` → `Authenticate`，浏览器授权后状态变为 `✓ Connected`。

## Token 登录型 MCP

以 GitHub 为例：

```bash
claude mcp add \
  --transport http \
  github \
  https://api.githubcopilot.com/mcp \
  --header "Authorization: Bearer ghp_xxxxxx"
```

或 JSON 配置：

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp",
      "headers": { "Authorization": "Bearer ghp_xxxxxx" }
    }
  }
}
```

## 团队共享 MCP

使用 `--scope project` 让团队成员 clone 后自动获得 MCP：

```bash
claude mcp add --scope project playwright -- npx -y @playwright/mcp@latest
```

这会生成 `.mcp.json`，提交到 Git：

```bash
git add .mcp.json && git commit -m "Add MCP config" && git push
```

团队成员 `git pull` 后首次进入 Claude 会提示授权，同意即可。

## 常用 MCP 推荐

### Playwright MCP（浏览器自动化）

```bash
claude mcp add playwright -- npx -y @playwright/mcp@latest
```

能力：打开网页、点击按钮、登录网站、自动测试、抓取内容。

### GitHub MCP

能力：查看 PR、创建 Issue、评论 PR、查询仓库。

### Notion MCP

能力：查询知识库、创建页面、更新文档。

### Sentry MCP

能力：查看错误、查询堆栈、分析线上异常。

### PostgreSQL MCP

能力：查询数据库、查看表结构、执行 SQL。
