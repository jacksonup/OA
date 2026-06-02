# 企业 OA 管理系统原型

这是一个可部署到 GitHub Pages 的企业 OA 管理系统前端原型。当前原型聚焦员工主档、部门管理、岗位管理等基础主数据维护。

## 在线部署

项目已配置 GitHub Actions。推送到 GitHub 仓库的 `main` 分支后，会自动构建并发布到 GitHub Pages。

发布后访问地址通常是：

```text
https://<github-username>.github.io/<repo-name>/
```

## 本地运行

```bash
cd oa-ui
npm install
npm run dev
```

## 本地构建

```bash
cd oa-ui
npm run build
```

## 项目结构

```text
.
├── .github/workflows/deploy.yml
├── oa-ui
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
└── 需求文档.md
```

## GitHub Pages 发布步骤

1. 登录 GitHub CLI：

```bash
gh auth login -h github.com
```

2. 在当前目录初始化并推送仓库：

```bash
git init
git add .
git commit -m "init oa prototype"
gh repo create oa-prototype --public --source=. --remote=origin --push
```

3. 进入 GitHub 仓库页面，打开 `Settings > Pages`，确认 Source 使用 `GitHub Actions`。

4. 等待 Actions 完成部署后，即可通过 GitHub Pages 公网地址访问。
