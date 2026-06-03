# Emoji Remote Classic

这是一个适合发布到 GitHub Pages 的手机端控制界面。

## 发布文件

上传这些文件到仓库根目录：

- `index.html`
- `mobile-remote-v1.html`
- `mobile-remote-v1.css`
- `mobile-remote-v1.js`
- `mobile-remote-v1.webmanifest`
- `mobile-remote-v1-sw.js`
- `bubble.png`
- `.nojekyll`

## GitHub Pages 发布步骤

1. 在 GitHub 新建一个仓库。
2. 把上面这些文件上传到仓库根目录。
3. 进入仓库 `Settings -> Pages`。
4. 在 `Build and deployment` 中选择：
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/ (root)`
5. 保存后等待 GitHub 生成页面地址。

## 打开地址

部署完成后，页面地址通常是：

- `https://你的用户名.github.io/仓库名/`

因为仓库根目录里有 `index.html`，打开仓库网址后会自动跳转到：

- `mobile-remote-v1.html`

## 手机上测试

1. 用手机浏览器打开 GitHub Pages 地址。
2. 等页面完全加载。
3. 在浏览器菜单里选择：
   - iPhone Safari：`添加到主屏幕`
   - Android Chrome：`安装应用` 或 `添加到主屏幕`

## 说明

- 这是网页安装版，不是原生 APK。
- 但它已经具备主屏幕安装能力，适合演示和测试交互。
