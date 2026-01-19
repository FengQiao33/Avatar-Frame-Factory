# 头像边框工厂 (Avatar Frame Factory)

社交平台头像边框生成器，可在浏览器内完成头像上传、主题选择（新年 / 毕业 / 粉丝应援 / 绿色守护等）、实时预览与 PNG 导出，适合在阿里云 ESA Pages 上低成本部署。

> 本项目由阿里云ESA提供加速、计算和保护  
> ![ESA 边缘安全加速](public/esa.svg)

## 在线地址
- Pages 访问链接：`<替换为您的 ESA Pages URL>`
- GitHub 仓库：`<替换为公开仓库地址>`

## 功能亮点
- 预置多套主题：渐变描边、角标 emoji、主题文案，一键切换。
- 形状可切：圆形 / 方形头像，支持描边厚度、遮罩强度和角标大小调节。
- 浏览器端渲染：Canvas 生成 1024x1024 PNG，隐私友好，无需后端。
- 可扩展：在 `src/main.js` 中追加主题、调整默认配色或输出尺寸。

## 快速开始
```bash
npm install
npm run dev    # 本地预览
npm run build  # 产出 dist 静态文件
```

## 部署到阿里云 ESA Pages
1) 将仓库推送到 GitHub（保持公开）。  
2) 在 ESA Pages 创建项目，选择 “从 GitHub 导入” 并授权仓库。  
3) 构建参数示例：  
   - 构建命令：`npm run build`  
   - 产物目录：`dist`  
4) 首次发布后，记录公网访问 URL，并回填到 README 与 `submission.txt`。

## 技术栈
- Vite + 原生 JS / Canvas 渲染
- 纯前端运行，无服务端依赖

## 作品说明（提交用摘要）
- 实用性：本地生成透明 PNG，可直接用于社交头像或粉丝团素材。
- 创意性：多主题渐变描边 + 角标 + 文案组合，支持随机推荐。
- 技术深度：前端 Canvas 封装遮罩、描边、角标和文案的分层绘制，单页即可部署到边缘。

## 目录结构
- `index.html`：应用入口
- `src/main.js`：主题配置、绘制逻辑、交互
- `src/styles.css`：页面样式
- `public/esa.svg`：ESA 说明图
- `submission.txt`：大赛要求的提交信息模板

## 版权与合规
仅包含自制素材与 Emoji，未引入第三方受限素材。请确保上传的头像不侵权。
