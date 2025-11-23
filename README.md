<p align="center">
  <img src="https://img.shields.io/badge/status-developing-blue" alt="Status"/>
  <img src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite"/>
</p>

# 🎸 布鲁斯吉他学习平台

这是一个为布鲁斯吉他爱好者设计的在线学习和练习平台。它内置了交互式曲谱播放器、课程目录、和弦图和节拍器等工具。项目采用现代Web技术构建，旨在提供流畅且响应式的用户体验。

## 🚀 主要功能

-   **交互式曲谱播放器**: 由 AlphaTab驱动，直接在浏览器中查看、播放和控制乐谱。
-   **课程目录**: 浏览和选择不同的课程。
-   **和弦与指板图**: 直观地查看和弦形状和指板布局。
-   **节拍器**: 使用内置的可调节节拍器来练习节奏。
-   **响应式设计**: 适配不同尺寸的屏幕。

## 🛠️ 技术栈

-   **前端**: React, TypeScript
-   **构建工具**: Vite
-   **路由**: React Router
-   **乐谱渲染**: AlphaTab
-   **样式**: Standard CSS

## ⚡ 本地开发

请按照以下步骤在您的本地环境中启动项目，以进行开发和测试。

### 环境要求

-   [Node.js](https://nodejs.org/) (建议 v18 或更高版本)
-   [npm](https://www.npmjs.com/) (通常随 Node.js 一起安装)

### 安装与运行

1.  **克隆仓库:**
    ```sh
    git clone https://github.com/your-username/blues-guitar-app.git
    cd blues-guitar-app
    ```

2.  **安装依赖:**
    ```sh
    npm install
    ```

3.  **启动开发服务器:**
    ```sh
    npm run dev
    ```
    应用将在 `http://localhost:5173` (如果端口被占用，可能会是其他端口) 上运行。

## ⚠️ 关于版权和许可的重要声明

本项目主要用于个人学习目的。如有版权等问题，请联系我删除相关内容。

### 曲谱与音频文件

位于 `public/tabs/` 和 `public/audio/` 目录下的示例曲谱文件 (`.gpx`, `.gp5`) 和音轨 (`.mp3`) **仅用于功能演示**。它们可能受到版权保护。

### 课程内容和书籍资料

本项目中的课程文本、图片或结构可能参考了现有教材。这些内容同样仅用于开发演示。

## 📄 许可证



本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。
