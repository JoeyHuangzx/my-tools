```
my-tools/
│
├── src/
│   ├── index.ts
│   ├── utils/
│   │   ├── fileMover.ts
│   │   └── templateCreator.ts
│   └── lib/
│       └── helper.js
├── dist/
├── tsconfig.json
└── package.json
```


* src/index.ts：项目的入口文件。
* src/utils/：存放具体工具集的功能文件（如文件移动、模板创建等）。
* src/lib/：存放一些共享的非TypeScript模块（如纯JavaScript的工具函数等）。
