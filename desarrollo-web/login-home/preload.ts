// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('appNav', {
  toHome: () => ipcRenderer.invoke('nav:toHome'),
  toLogin: () => ipcRenderer.invoke('nav:toLogin'),
});

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
}
});

contextBridge.exposeInMainWorld('http', {
  get: (url: string, options?: any) => ipcRenderer.invoke('http:get', url, options),
  post: (url: string, body: any, options?: any) => ipcRenderer.invoke('http:post', url, body, options),
});
