import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { PrismaClient, Note } from '@prisma/client';

const prisma = new PrismaClient();

interface Response<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export class noteHandler {
  setupHandlers(): void {
    console.log("noteHandler kuruluyor...");

    ipcMain.handle("note:getAll", async (_event: IpcMainInvokeEvent, userId: number): Promise<Note[]> => {
      return await prisma.note.findMany({
        where: {
          userId,
          isDeleted: false
        },
        orderBy: { createdAt: 'desc' }
      });
    });

    ipcMain.handle("note:add", async (_event: IpcMainInvokeEvent, not: { title: string; text: string; userId: number; }): Promise<Response<Note>> => {
      const result = await prisma.note.create({
        data: {
          title: not.title,
          text: not.text,
          userId: not.userId
        }
      });
      return { success: true, data: result };
    });

    ipcMain.handle("note:delete", async (_event: IpcMainInvokeEvent, id: number): Promise<Response> => {
      try {
        await prisma.note.update({
          where: { id },
          data: { isDeleted: true }
        });
        return { success: true };
      } catch (error) {
        console.error("Silme hatası:", error);
        return { success: false, message: "Silme işlemi başarısız" };
      }
    });

    ipcMain.handle("note:archive", async (_event: IpcMainInvokeEvent, id: number): Promise<Response> => {
      try {
        const note = await prisma.note.findUnique({ where: { id } });
        if (!note) {
          return { success: false, message: "Not bulunamadı" };
        }
        await prisma.note.update({
          where: { id },
          data: { isArchived: true }
        });
        return { success: true, message: "Not arşivlendi" };
      } catch (error) {
        console.error("Arşivleme hatası:", error);
        return { success: false, message: "Bir hata oluştu" };
      }
    });

    ipcMain.handle("note:unarchive", async (_event: IpcMainInvokeEvent, id: number): Promise<Response> => {
      await prisma.note.update({
        where: { id },
        data: { isArchived: false }
      });
      return { success: true };
    });

   ipcMain.handle('note:update', async (_event, payload) => {
  console.log("note:update payload:", payload);
  try {
    const { id, ...data } = payload;
    console.log("id:", id);
    console.log("data:", data);
    const updatedNote = await prisma.note.update({
      where: { id },
      data: data,
    });
    return { success: true, data: updatedNote };
  } catch (error) {
    console.error("Not güncelleme hatası:", error);
    return { success: false, message: "Güncelleme sırasında hata oluştu" };
  }
});
  }
}
