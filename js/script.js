// 主入口文件
// 按顺序加载所有模块
document.addEventListener("DOMContentLoaded", function () {
  // 动态加载模块
  const modules = [
    'core.js',
    'formatter.js',
    'editor.js',
    'theme.js',
    'media.js'
  ];
  
  // 按顺序加载模块
  modules.forEach(module => {
    const script = document.createElement('script');
    script.src = `js/${module}`;
    document.body.appendChild(script);
  });
});