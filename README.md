# my-tools

一个前端/游戏开发的开发工具集（TypeScript CLI）。把日常重复性杂务固化为独立命令：AI 问答归档、目录结构导出、图片压缩、HLS 视频下载、算法练习验证。

## 目录结构

```
my-tools/
│
├── src/
│   ├── index.ts              # 入口：pnpm dev，目录结构导出
│   ├── ai.ts                 # 入口：pnpm ai，AI 问答（doubao / deepseek 路由）
│   ├── fileUtil.ts           # 入口：pnpm file，目录结构导出（与 index.ts 同功能）
│   ├── tinyTest.ts           # 入口：pnpm tiny，TinyPNG 图片压缩
│   ├── env.d.ts              # 环境变量类型声明
│   ├── ai/                   # AI 问答模块
│   │   ├── doubao.ts         # 火山方舟（豆包）流式问答，写入 ASK/doubao-*.md
│   │   ├── deepseek.ts       # DeepSeek reasoner 流式问答，写入 ASK/deepseek-*.md
│   │   └── chatgpt.ts        # OpenAI gpt-4o-mini（已限流 429，暂不可用，未接入入口）
│   ├── utils/                # 文件工具模块
│   │   ├── traverse.ts       # 目录递归遍历，导出 output.json / names-output.json
│   │   ├── FolderNode.ts     # 文件夹树节点类（预留，暂未使用）
│   │   └── fileMover.ts      # 按名单匹配移动文件归档（备用脚本，无入口）
│   ├── tinyPNG/              # 图片压缩模块
│   │   ├── compressImage.ts  # 调 TinyPNG 网页接口压缩单张图片
│   │   ├── api.ts            # 压缩结果 TS 类型定义（预留）
│   │   └── test.js/test2.js  # 参考实现（批量/md5 去重/并发，依赖未装，仅参考）
│   ├── video_utils/          # 视频工具模块（纯 JS，需系统安装 ffmpeg）
│   │   ├── download.js       # 解析混淆 HLS 标识串，spawn ffmpeg 下载
│   │   └── file_index.js     # 扫描 htmlFiles/ 网页快照，批量提取并下载
│   ├── leetcode/             # 算法练习模块
│   │   ├── index.ts          # 入口：pnpm leetcode，直接运行题解用例
│   │   ├── 7_reverse.ts      # LeetCode 7 整数反转
│   │   └── DeleteAndEarn.ts  # LeetCode 740 删除并获得点数
│   └── lib/
│       └── helper.js         # 示例函数（无实际用途）
├── ASK/                      # AI 问答输出目录（markdown 知识库）
├── .env                      # API 密钥（勿提交）
├── tsconfig.json
└── package.json
```

## 环境准备

```bash
pnpm install          # 安装依赖
```

在项目根目录创建 `.env`，填入所需密钥：

```ini
OPENAI_API_KEY=          # DeepSeek 使用的密钥
OPENAI_DOUBAO_API_KEY=   # 豆包（火山方舟）使用的密钥
CHATGPT_API_KEY=         # OpenAI（当前已限流，可不配）
```

视频下载功能需要系统 PATH 中可用的 `ffmpeg`。

## 各模块使用说明

### AI 问答（pnpm ai）

```bash
pnpm ai doubao "cocos creator 如何优化 drawcall"   # 走豆包（火山方舟）
pnpm ai anything "我需要一个内存优化技巧清单"       # 第一个参数非 doubao 即走 deepseek-reasoner
```

- 参数：`argv[2]` 为模型选择（`doubao` 或其他任意值），`argv[3]` 为问题内容
- 行为：终端流式打印回答，同时写入 `ASK/{模型}-{问题}.md`（问题文本会清洗为合法文件名）
- 不带参数运行会打印 Usage 并退出
- 输出目录 `ASK/` 同时作为个人知识库沉淀

### 目录结构导出（pnpm dev / pnpm file）

```bash
pnpm dev <目标目录路径>
pnpm file <目标目录路径>     # 与 dev 完全同功能
```

- 递归遍历目标目录，纯文件目录折叠为文件名数组，混合目录输出嵌套对象
- 生成两个文件：`output.json`（树形结构）与 `names-output.json`（扁平文件名列表），同时打印到控制台
- 典型场景：盘点资源目录、为 LLM 提供项目结构上下文

### 图片压缩（pnpm tiny）

```bash
pnpm tiny <源图片路径> <输出图片路径>
# 示例
pnpm tiny ./demo.jpg ./demo2.jpg
```

- 调用 TinyPNG 网页版接口（`tinypng.com/backend/opt/shrink`），无需 API Key
- 流程：上传本地图片 → 获取压缩后 URL 与压缩率 → 流式下载到目标路径
- 注意：网页接口有隐式频率限制，不适合高频批量压缩

### 视频下载（手动运行，纯 JS）

```bash
node src/video_utils/download.js     # 编辑文件内顶部的 URL 与输出文件名数组后运行
node src/video_utils/file_index.js   # 将网页快照放入 ./htmlFiles/ 后运行
```

- `download.js`：把 `m3u8|id1|seg|...` 格式的混淆标识串重组为 playlist.m3u8 地址，逐个 spawn ffmpeg 以 `-c copy` 无转码下载
- `file_index.js`：递归扫描 `./htmlFiles/` 下保存的网页，正则提取 m3u8 源与 `<title>`（标题清洗为文件名），全部解析完后并发下载并打印进度
- 依赖系统 ffmpeg；输出到当前目录（file_index.js 输出到 `video/` 子目录）

### 算法练习（pnpm leetcode）

```bash
pnpm leetcode
```

- 直接运行 `src/leetcode/index.ts` 中硬编码的用例（当前为 `deleteAndEarn([3, 4, 2])`）
- 切换题目需手动修改 index.ts 中的 import 与调用

## 架构说明

- TypeScript（`strict: true`）→ `tsc` 编译至 `dist/` → Node 直跑；每条命令执行前都会重新编译
- AI 模块统一使用 OpenAI SDK 兼容协议，通过替换 `baseURL` 切换厂商（火山方舟 / DeepSeek / OpenAI）
- 5 个 CLI 入口互相独立，无循环依赖；模块间数据交换仅通过文件系统（`ASK/*.md`、`output*.json`、图片、视频）
- `src/utils/traverse.ts` 是唯一被多个入口（dev / file）共享的业务模块

## 注意事项

- `.env` 含密钥，请勿提交到仓库
- `src/ai/chatgpt.ts` 因 OpenAI 配额（429）暂不可用，且未接入 `pnpm ai` 路由
- `src/utils/FolderNode.ts`、`src/tinyPNG/api.ts`、`src/tinyPNG/test*.js` 为预留/参考代码，未被引用
- `src/utils/fileMover.ts` 内含硬编码路径与个人名单，属备用脚本，无入口调用
- `traverse.ts` 的 `nameArr` 为模块级状态，同进程内多次调用会累积结果
- `src/video_utils` 与 `src/tinyPNG/test*.js` 为纯 JS，不经过 tsc 类型检查
