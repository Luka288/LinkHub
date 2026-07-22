import { Component, inject } from '@angular/core';
import { QRservice } from '../../../../core/services/qr.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Button } from '../../button/button';
import { DownloadButton } from '../../download-button/download-button';

@Component({
  selector: 'app-qr-modal',
  imports: [DownloadButton],
  templateUrl: './qr-modal.html',
  styleUrl: './qr-modal.scss',
})
export class QrModal {
  private readonly QR = inject(QRservice);

  readonly qrData = toSignal<{ qr: string }>(this.QR.generateQRCode());

  saveAction(): void {
    //
  }

  copyAction(): void {
    //
  }
}
