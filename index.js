const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const wifi = require("node-wifi");

// Initialize node-wifi
wifi.init({
  iface: null, // network interface, choose a random wifi interface if set to null
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false, // Ensure nodeIntegration is false
      contextIsolation: true, // Enable contextIsolation
    },
  });

  mainWindow.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Handle scan-wifi event
ipcMain.handle("get-ssid", async () => {
  try {
    const getCurrentConnections = await wifi.getCurrentConnections();
    return getCurrentConnections;
  } catch (error) {
    throw new Error(error);
  }
});

ipcMain.handle("upload-speed-test", async () => {
  const file = new Blob([new ArrayBuffer(4194530)], {
    type: "application/octet-stream",
  });
  const url = "https://mivelocidadmex.axtel.com.mx:8080/speedtest/upload";
  const startTime = new Date().getTime();

  try {
    const response = await fetch(url, {
      method: "POST",
      body: file,
    });

    if (response.ok) {
      const endTime = new Date().getTime();
      const duration = (endTime - startTime) / 1000; // in seconds
      const fileSize = file.size / (1024 * 1024); // in MB
      const speedMbps = (fileSize * 8) / duration; // in Mbps
      return speedMbps.toFixed(2);
    } else {
      throw new Error("Error al upload");
    }
  } catch (error) {
    throw new Error("Error al upload");
  }
});

ipcMain.handle("download-speed-test", async () => {
  const url =
    "https://mivelocidadmex.axtel.com.mx:8080/download?nocache=d844e5fc-e309-4420-939f-25d48682e6d7&size=25000000&guid=f88e8a10-196f-11ef-971f-b901d599d34f";
  const startTime = new Date().getTime();

  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (response.ok) {
      const blob = await response.blob();
      const endTime = new Date().getTime();
      const duration = (endTime - startTime) / 1000; // in seconds
      const fileSize = blob.size / (1024 * 1024); // in MB
      const speedMbps = (fileSize * 8) / duration; // in Mbps
      return speedMbps;
    } else {
      throw new Error("Error al download");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al download");
  }
});

ipcMain.handle("get-ip", async () => {
  try {
    const response = await fetch("http://ip-api.com/json").then((response) =>
      response.json()
    );
    return response;
  } catch (error) {
    throw new Error("Error al obtener la ip");
  }
});

ipcMain.handle("get-ping", async () => {
  const startTime = new Date().getTime();
  try {
    await fetch("https://mivelocidadmex.axtel.com.mx:8080/hello");
    const endTime = new Date().getTime();
    const ping = endTime - startTime;
    return ping;
  } catch (error) {
    throw new Error("Error al obtener la ip");
  }
});
