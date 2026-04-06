import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { Backpack } from '../../core/models/image.model';
import { BackpacksService } from '../../core/services/backpacks.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  backpacks: Backpack[] = [];
  isLoadingBackpacks = false;
  loadError: string | null = null;

  uploadName = '';
  uploadDescription = 'Mochila artesanal colombiana, tejida a mano con materiales de alta calidad.';
  uploadPrice: number | null = null;
  uploadImageFiles: File[] = [];
  uploadPreviews: string[] = [];

  isUploading = false;
  uploadMessage: string | null = null;
  uploadError: string | null = null;

  ngOnInit(): void {
    this.loadBackpacks();
  }

  constructor(private readonly backpacksService: BackpacksService) {}

  onUploadImagesChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    this.uploadImageFiles = files;
    this.uploadError = null;
    this.uploadMessage = null;

    // Generate preview URLs
    this.uploadPreviews.forEach((url) => URL.revokeObjectURL(url));
    this.uploadPreviews = files.map((f) => URL.createObjectURL(f));
  }

  removePreview(index: number): void {
    URL.revokeObjectURL(this.uploadPreviews[index]);
    this.uploadPreviews.splice(index, 1);
    this.uploadImageFiles.splice(index, 1);
  }

  submitBackpack(): void {
    if (this.isUploading) return;

    const name = this.uploadName.trim();
    if (!name) {
      this.uploadError = 'El nombre es obligatorio.';
      return;
    }

    if (this.uploadImageFiles.length === 0) {
      this.uploadError = 'Debes seleccionar al menos una imagen.';
      return;
    }

    this.isUploading = true;
    this.uploadError = null;
    this.uploadMessage = null;

    this.backpacksService
      .createBackpack({
        name,
        description: this.uploadDescription.trim(),
        price: this.uploadPrice,
        images: this.uploadImageFiles,
      })
      .pipe(finalize(() => { this.isUploading = false; }))
      .subscribe({
        next: () => {
          this.uploadMessage = 'Mochila guardada correctamente.';
          this.resetUploadForm();
          this.loadBackpacks();
        },
        error: (error: unknown) => {
          this.uploadError = this.getUploadErrorMessage(error);
        },
      });
  }

  formatPrice(price: number | null): string {
    if (price === null) return 'Precio por consulta';

    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(price);
  }

  trackByBackpackId(_index: number, backpack: Backpack): string {
    return backpack.id;
  }

  private loadBackpacks(): void {
    this.isLoadingBackpacks = true;
    this.loadError = null;

    this.backpacksService
      .getBackpacks()
      .pipe(finalize(() => { this.isLoadingBackpacks = false; }))
      .subscribe({
        next: (backpacks) => { this.backpacks = backpacks; },
        error: () => {
          this.backpacks = [];
          this.loadError = 'No se pudieron cargar las mochilas.';
        },
      });
  }

  private resetUploadForm(): void {
    this.uploadName = '';
    this.uploadDescription = 'Mochila artesanal colombiana, tejida a mano con materiales de alta calidad.';
    this.uploadPrice = null;
    this.uploadPreviews.forEach((url) => URL.revokeObjectURL(url));
    this.uploadImageFiles = [];
    this.uploadPreviews = [];
  }

  private getUploadErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (typeof error.error === 'string') return error.error;

      if (typeof error.error === 'object' && error.error !== null) {
        const message = (error.error as { message?: string | string[] }).message;
        if (Array.isArray(message) && message.length > 0) return message.join(', ');
        if (typeof message === 'string') return message;
      }
    }

    return 'No fue posible guardar la mochila. Intenta otra vez.';
  }
}
