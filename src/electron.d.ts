export {};

declare global {
  interface Window {
    api: {
      login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
      getnotlar: (id: number) => Promise<any>;
      deleteNot: (id: number) => Promise<any>;
      addNot: (note: { title: string; text: string; userId: number }) => Promise<any>;
      archiveNot: (id: number) => Promise<any>;
      unarchiveNot: (id: number) => Promise<any>;
      register: (register: RegisterDto) => Promise<{ success: boolean; message: string }>;
      updatenot: (id: number, not: { title?: string; text?: string ,updatedAt?:date}) => Promise<any>;
    };
  }
}
