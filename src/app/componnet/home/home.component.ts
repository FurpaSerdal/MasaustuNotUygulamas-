import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../service/userservice/userservice.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  notlar: Note[] = [];
  arsivlenenNotlar: Note[] = [];
  editingNoteId: number | null = null; // Düzenleme için seçilen notun ID'si
  
  newNote: { title: string; text: string } = {
    title: '',
    text: ''
    
  };
  
  showArchive: boolean = false;
  isLoading: boolean = false;        // Yükleniyor durumu (isteğe bağlı)
  errorMessage: string | null = null; // Hata mesajı göstermek için (isteğe bağlı)

  constructor(
    public userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllNotlar();
  }

  async getAllNotlar(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = null;
    try {
      const userId = this.userService.kullanici();
      console.log("Aktif kullanıcı ID:", userId);
      
      const response = await window.api.getnotlar(userId) as Note[];
      console.log('Notlar:', response);

      this.notlar = response.filter(n => !n.isArchived && !n.isDeleted);
      this.arsivlenenNotlar = response.filter(n => n.isArchived && !n.isDeleted);

    } catch (err) {
      console.error('Notları alırken hata oluştu:', err);
      this.errorMessage = 'Notlar yüklenirken bir hata oluştu.';
    } finally {
      this.isLoading = false;
    }
  }

  async addNot(): Promise<void> {
    if (!this.newNote.text.trim()) {
      this.errorMessage = 'Not içeriği boş olamaz.';
      return;
    }
    
    this.errorMessage = null;

    try {
      const noteToAdd = {
        title: this.newNote.title.trim(),
        text: this.newNote.text.trim(),
        userId: this.userService.kullanici()
      };

      const response = await window.api.addNot(noteToAdd);
      console.log('Not eklendi:', response);

      this.newNote.title = '';
      this.newNote.text = '';

      await this.getAllNotlar();
    } catch (err) {
      console.error('Not eklerken hata oluştu:', err);
      this.errorMessage = 'Not eklenirken bir hata oluştu.';
    }
  }

  async deleteNot(id: number): Promise<void> {
    try {
      const response = await window.api.deleteNot(id);
      console.log('Not silindi:', response);

      await this.getAllNotlar();
    } catch (err) {
      console.error('Not silerken hata oluştu:', err);
      this.errorMessage = 'Not silinirken bir hata oluştu.';
    }
  }

  async archiveNot(id: number): Promise<void> {
    try {
      const response = await window.api.archiveNot(id);
      console.log('Not arşivlendi:', response);

      await this.getAllNotlar();
    } catch (err) {
      console.error('Not arşivlenirken hata oluştu:', err);
      this.errorMessage = 'Not arşivlenirken bir hata oluştu.';
    }
  }

  async unarchiveNot(id: number): Promise<void> {
    try {
      const response = await window.api.unarchiveNot(id);
      console.log('Not arşivden çıkarıldı:', response);

      await this.getAllNotlar();
    } catch (err) {
      console.error('Not arşivden çıkarılırken hata oluştu:', err);
      this.errorMessage = 'Not arşivden çıkarılırken bir hata oluştu.';
    }
  }

  async updateNot(id: number, not:any): Promise<void> {
    console.log('Güncelleniyor:', id,not);
    try {
      const response = await window.api.updatenot(id, not);
      console.log('Not güncellendi:', response);

      await this.getAllNotlar();
    } catch (err) {
      console.error('Not güncellerken hata oluştu:', err);
      this.errorMessage = 'Not güncellenirken bir hata oluştu.';
    }
  }

  toggleArchiveView(): void {
    this.showArchive = !this.showArchive;
  }
restoreNot(id: number): void {
  console.log('Not geri yükleniyor:', id);
  // İlgili notu bul
  const not = this.notlar.find(n => n.id === id);
  
  if (not) {
    // newNote nesnesini bulduğun notun bilgileri ile doldur
    this.newNote = {
      title: not.title || '',
      text: not.text,


    };
    
    // Düzenleme yapılacağı için, ayrıca güncelleme için id bilgisini de tutabilirsin
    this.editingNoteId = id;
  } else {
    // Not bulunamazsa newNote'u boşalt
    this.newNote = { title: '', text: '' };
    this.editingNoteId = null;
  }
}
async updateNotByButton(): Promise<void> {
  console.log('Güncelleniyor:', this.newNote, this.editingNoteId);
  if (!this.newNote.text.trim() || !this.editingNoteId) return;

  const updatedNot = {
    title: this.newNote.title.trim(),
    text: this.newNote.text.trim(),
    updatedAt: new Date()
  };

  try {
    await this.updateNot(this.editingNoteId, updatedNot);
    console.log('Not güncellendi:', this.editingNoteId,updatedNot);
    this.newNote = { title: '', text: '',};
    this.editingNoteId = null;
  } catch (error) {
    console.error('Not güncellenirken hata:', error);
    this.errorMessage = 'Not güncellenirken bir hata oluştu.';
  }
}




  logout(): void {
    this.userService.setKullanici(0);
    this.router.navigate(['/login']);
  }


}

interface Note {
  id: number;
  title?: string;
  text: string;
  userId: number;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
