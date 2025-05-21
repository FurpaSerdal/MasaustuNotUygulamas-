import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../service/userservice/userservice.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  name: string = '';
  password: string = '';
  email: string = '';
  activeInput: 'name' | 'password' = 'name';
  isRegisterMode: boolean = false;

  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'SİL', 0];
  message = '';

  constructor(private router: Router, public userService: UserService) {}

  ngOnInit() {
    console.log('window.api:', (window as any).api);
  }

  toggleMode(event: Event) {
    event.preventDefault();
    this.isRegisterMode = !this.isRegisterMode;
    this.message = '';
    this.name = '';
    this.password = '';
    this.email = '';
  }

  handleNumberClick(num: any) {
    if (num === 'SİL') {
      if (this.activeInput === 'name') this.name = this.name.slice(0, -1);
      else this.password = this.password.slice(0, -1);
    } else {
      if (this.activeInput === 'name') this.name += num;
      else this.password += num;
    }
  }

  async login() {
    if (!this.name || !this.password) {
      this.message = 'Lütfen kullanıcı adı ve şifre girin.';
      return;
    }

    try {
      const response = await (window as any).api.login(this.name, this.password);
      console.log('Login response:', response);

      if (response.userId) {
        this.userService.setKullanici(response.userId);
      }

      if (response.success) {
        this.message = 'Giriş başarılı';
        this.router.navigate(['/home']);
      } else {
        this.message = response.message;
      }
    } catch (err) {
      this.message = 'Giriş sırasında hata oluştu';
    }
  }

  async register() {
    if (!this.name || !this.password) {
      this.message = 'Lütfen kullanıcı adı ve şifre girin.';
      return;
    }

    const dto = {
      username: this.name,
      password: this.password,
      email: this.email || undefined,
    };

    try {
      const response = await (window as any).api.register(dto);
      console.log('Register response:', response);

      if (response.success) {
        this.message = 'Kayıt başarılı. Giriş yapabilirsiniz.';
        this.toggleMode(new Event('click'));
      } else {
        this.message = response.message;
      }
    } catch (err) {
      this.message = 'Kayıt sırasında hata oluştu';
    }
  }

  onSubmit() {
    if (this.isRegisterMode) {
      this.register();
    } else {
      this.login();
    }
  }
}
