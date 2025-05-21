import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

interface LoginResult {
  success: boolean;
  message: string;
  userId?: number;
  username?: string;
}

export interface RegisterDto {
  username: string;
  email?: string;
  password: string;
}

export class AuthHandler {
  setupHandlers(): void {
    console.log("AuthHandler kuruluyor...");

    ipcMain.handle("user:login", async (_event: IpcMainInvokeEvent, username: string, password: string): Promise<LoginResult> => {
      console.log("Giriş denemesi:", username, password);

      try {
        const user: User | null = await prisma.user.findUnique({ where: { username } });

        if (!user) {
          return { success: false, message: "Kullanıcı bulunamadı" };
        }

        // Basit düz metin şifre kontrolü (gerçek projede bcrypt kullan!)
        if (user.password !== password) {
          return { success: false, message: "Şifre yanlış" };
        }

        return { success: true, message: "Giriş başarılı", userId: user.id, username: user.username };
      } catch (error) {
        console.error("Login sırasında hata:", error);
        return { success: false, message: "Sunucu hatası" };
      }
    });

    ipcMain.handle("user:register", async (_event: IpcMainInvokeEvent, dto: RegisterDto): Promise<LoginResult> => {
      try {
        const existingUser = await prisma.user.findUnique({ where: { username: dto.username } });

        if (existingUser) {
          return { success: false, message: "Kullanıcı adı zaten mevcut" };
        }

        const user = await prisma.user.create({
          data: {
            username: dto.username,
            email: dto.email || null,
            password: dto.password, // Gerçek projede hashlemeyi unutma!
            isAdmin: false,
            notes: {
              create: [],
            },
          },
          include: {
            notes: true,
          },
        });

        return { success: true, message: "Kayıt başarılı", userId: user.id, username: user.username };
      } catch (error) {
        console.error("Kayıt sırasında hata:", error);
        return { success: false, message: "Sunucu hatası" };
      }

    });


  }
}
