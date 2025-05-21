import { contextBridge, ipcRenderer } from 'electron';

import { RegisterDto } from '../electron/ipc/handlers/AuthHandler.js';

contextBridge.exposeInMainWorld('api', {
  login: (username: string, password: string): Promise<any> =>
    ipcRenderer.invoke('user:login', username, password),

  register: (register: RegisterDto): Promise<any> =>
    ipcRenderer.invoke('user:register', register),  

  getnotlar: (id: number): Promise<any> =>
    ipcRenderer.invoke('note:getAll', id),

  deleteNot: (id: number): Promise<any> =>
    ipcRenderer.invoke('note:delete', id),

  addNot: (not: any): Promise<any> =>
    ipcRenderer.invoke('note:add', not),

  archiveNot: (id: number): Promise<any> =>
    ipcRenderer.invoke('note:archive', id),

  unarchiveNot: (id: number): Promise<any> =>
    ipcRenderer.invoke('note:unarchive', id),
  updatenot: (id: number, not: { title?: string; text?: string; [key: string]: any }): Promise<any> =>
  ipcRenderer.invoke('note:update', { id, ...not }),

});
