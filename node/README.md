# 使用 patch-package 修复 npm 包中的 bug

## 开发环境
```bash
$ npx patch-package <package-name>
```

tips: 注意需要将修复文件提交到版本管理之中

```bash
$ git add patches/lodash+4.17.21.patch
$ git commit -m "fix: lodash bug"
```

## 生产环境
```bash
$ npx patch-package
```
