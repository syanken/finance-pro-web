# Finance Pro Web

轻量级股票行情与量化策略前端，基于 React 19 + React-Router v6 + lightweight-charts 实现。

## 一键启动

```bash
npm i         # 安装依赖
npm start     # 本地开发 http://localhost:3000
npm test      # 单元测试
npm run build # 生成 build 目录用于生产部署
```

## 主要页面
首页 - 仪表盘总览  
行情 - 股票列表与 K 线图表  
策略 - 选股条件 + 代码编辑器  
回测 - 策略回测结果与收益曲线

## 技术栈
React 19 + Hooks  
React Router v6  
lightweight-charts（K 线）  
react-window + AutoSizer（高性能列表）  
Jest + React Testing Library  

## 后端
项目地址 https://github.com/syanken/finance-pro-node  
默认代理到 http://localhost:3001，可在 package.json 的 proxy 字段修改。
