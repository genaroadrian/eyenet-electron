const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  getSsid: () => ipcRenderer.invoke("get-ssid"),
  startUploadSpeedTest: () => ipcRenderer.invoke("upload-speed-test"),
  startDownloadSpeedTest: () => ipcRenderer.invoke("download-speed-test"),
  getIp: () => ipcRenderer.invoke("get-ip"),
  getPing: () => ipcRenderer.invoke("get-ping"),
});
