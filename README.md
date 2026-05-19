# mallchat-uniapp

MallChat UniApp 小程序端，使用 UniApp + Vue 3 对齐 MallChat 的 QQ-like IM 移动端体验。

## 当前定位

1. 与 `mallchat-taro` 保持产品结构一致，覆盖消息、联系人、动态和聊天详情主流程。
2. 复用 `mallchat-cloud` 已有后端接口，不另建并行协议或并行数据模型。
3. 后续跨端能力差异应先在文档中说明，再做实现。

## 常用命令

```bash
npm run dev:mp-weixin
npm run build:mp-weixin
bash scripts/validate-repository.sh
```

## 规范入口

1. 全局协作规范见 `AGENTS.md`。
2. 当前项目局部规范见 `AGENTS.local.md`。
3. 长期产品、设计、验收和运维文档放入 `docs/` 对应目录。
