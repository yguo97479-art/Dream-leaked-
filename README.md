# DREAM LEAKED — 虚构同人恋情曝光模拟器

React + Vite 静态站点，可部署至 Vercel。与 NCT DREAM 或任何官方机构无关。所有恋爱、私信、曝光帖、账号及事件均为虚构。不会连接真实 Instagram/X/KakaoTalk。

## 已实现
- 开始新游戏时六选一：JENO、HAECHAN、JAEMIN、RENJUN、CHENLE、JISUNG。
- 自定义玩家姓名和 Instagram 用户名。
- 六条独立虚构线索、男友消息、粉丝讨论。
- iPhone 风格桌面、KakaoTalk、Instagram、X 舆论、相册、备忘录、通话记录。
- Instagram 陌生私信自由输入回复，并在游戏内 X 页面生成对应截图传播事件（演示规则：所有回复均触发，正式版可扩展为概率与 NPC 决策）。
- 多存档，每次新游戏可重新选择成员；localStorage 自动保存。

## 本地运行
```bash
npm install
npm run dev
```

## Vercel 部署（iPad）
1. 解压 ZIP，在 GitHub 创建一个新仓库，上传项目根目录下的 `index.html`、`package.json`、`src` 文件夹、`README.md`。
2. 在 https://vercel.com/new 导入仓库。
3. Framework Preset 选择 Vite，Build Command 为 `npm run build`，Output Directory 为 `dist`。
4. Deploy。以后向 GitHub 推送修改，Vercel 会自动重新部署。

## 重要限制
- 目前是可玩 MVP：图片为占位符、NPC 舆论为本地规则模拟、无 AI 后端。
- 本地存档仅保存在当前浏览器和设备；清理浏览器网站数据可能丢失存档。
- 用户自由回复目前会在游戏内 X 生成虚构截图帖；不会对真实社交平台发帖。
- 上线前可继续扩展时间线、分支结局、隐藏相册、角色独立剧情与舆论概率。
