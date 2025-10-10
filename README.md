# JavaScript 学习代码 (Monorepo)

这是一个使用 pnpm 管理的 JavaScript 学习代码 monorepo。所有代码都按照功能组织在 packages 目录下。

## 目录结构

### packages/
- frontend/ - 前端相关代码
  - browser/ - 浏览器端运行的学习代码
  - css/ - CSS 相关学习代码
  - webgl/ - WebGL 相关学习代码
  - visualization/ - 可视化相关学习代码
- backend/ - 后端相关代码
  - node/ - Node.js 相关代码
  - databases/ - 数据库相关 (Drizzle, Prisma)
  - cache/ - 缓存相关 (Redis)
  - api/ - API 相关 (tRPC)
- lang-features/ - JavaScript 语言特性
  - es6-plus/ - ES6+ 语法和新特性
  - typescript/ - TypeScript 相关
  - babel/ - Babel 相关
- utilities/ - 工具和通用模式
  - design-patterns/ - JavaScript 设计模式
  - functional/ - 函数式编程
- tooling/ - 构建工具和开发工具
  - webpack/ - Webpack 相关示例
  - examples-tools/ - 其他构建工具示例
- examples/ - 示例和练习
  - interview/ - 面试题
  - practice/ - 其他练习和实验

## 使用说明

这个 monorepo 使用 pnpm workspaces 进行管理。

### 安装依赖
```bash
pnpm install
```

### 运行脚本
所有包支持以下通用脚本：
- `pnpm build` - 构建所有包
- `pnpm dev` - 开发模式
- `pnpm test` - 运行测试
- `pnpm lint` - 代码检查

也可以单独运行特定包的命令：
```bash
pnpm --filter @js-example/frontend dev
pnpm --filter @js-example/backend build
```

## 添加新包

如果要添加新功能，创建一个新的包：
```bash
mkdir packages/<new-package-name>
cd packages/<new-package-name>
npm init  # 或使用预设的 package.json 模板
```

## 优势

1. **统一的依赖管理** - 通过 pnpm workspace 共享依赖
2. **易于维护** - 按功能模块组织，职责清晰
3. **可扩展性** - 轻松添加新的功能模块
4. **独立的包** - 每个包都可以独立开发和测试
5. **一致的作者信息** - 所有包都归属于 DimplesY
