import { AuthHandler } from "./handlers/AuthHandler";
import { noteHandler } from "./handlers/noteHandler";

export async function setupIpcHandlers(): Promise<void> {
  console.log("IPC Handlers kuruluyor...");
  
  const handlers = [
    new noteHandler(),
    new AuthHandler(),
  ];

  handlers.forEach(handler => handler.setupHandlers());
}
