import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL } from '../consts/api.endpoint';

@Injectable({
  providedIn: 'root',
})
export class QRservice {
  private readonly http = inject(HttpClient);

  generateQRCode() {
    return this.http.get<{ qr: string }>(`${BASE_URL}/qr`);
  }
}
