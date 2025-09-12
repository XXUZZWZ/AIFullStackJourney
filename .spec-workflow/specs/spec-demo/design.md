设计思路：
- 使用 spec-workflow MCP 工具管理规范文档
- 目录：.spec-workflow/specs/spec-demo/{requirements.md,design.md,tasks.md}
- 文档格式：Markdown，简洁结构化
依赖：
- Node + npx 可正常运行
- Cursor MCP 加载 spec-workflow 成功
风险：
- Windows 路径兼容性
- 网络导致 npx 拉取失败