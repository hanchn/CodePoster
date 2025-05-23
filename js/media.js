import { setupImageGeneration } from './imageGenerator.js';
import { setupVideoRecording } from './videoRecorder.js';

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    if (!window.CodePoster) {
      console.error("CodePoster全局对象未定义");
      return;
    }
    
    try {
      setupImageGeneration();
      setupVideoRecording();
    } catch (error) {
      console.error("初始化失败:", error);
    }
  }, 100);
});