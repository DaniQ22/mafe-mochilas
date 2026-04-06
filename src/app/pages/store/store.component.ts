import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { Backpack } from '../../core/models/image.model';
import { BackpacksService } from '../../core/services/backpacks.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
})
export class StoreComponent implements OnInit {
  selectedBackpack: Backpack | null = null;
  carouselIndex = 0;

  readonly whatsappNumber = '573012098987';
  readonly whatsappMessage = 'Hola! Quiero informacion de esta mochila.';
  readonly currentYear = new Date().getFullYear();

  backpacks: Backpack[] = [];
  isLoadingBackpacks = false;
  loadError: string | null = null;

  readonly features = [
    { icon: 'UNICO', title: 'Disenos Unicos', desc: 'Cada mochila tiene identidad propia.' },
    { icon: 'HECHO A MANO', title: 'Proceso Artesanal', desc: 'Acabados cuidados en cada detalle.' },
    { icon: 'FUNCIONAL', title: 'Estilo y Practicidad', desc: 'Ideales para uso diario con look moderno.' },
  ];

  constructor(private readonly backpacksService: BackpacksService) {}

  ngOnInit(): void {
    this.loadBackpacks();
  }

  get heroImageUrl(): string {
    return this.backpacks[0]?.imageUrls[0] ?? 'assets/images/image-1.jpg';
  }

  openWhatsApp(backpackName?: string): void {
    const message = backpackName
      ? `Hola! Quiero informacion de la mochila: ${backpackName}`
      : this.whatsappMessage;

    const url = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  openDetail(backpack: Backpack): void {
    this.selectedBackpack = backpack;
    this.carouselIndex = 0;
  }

  closeModal(): void {
    this.selectedBackpack = null;
    this.carouselIndex = 0;
  }

  prevImage(): void {
    if (!this.selectedBackpack) return;
    const len = this.selectedBackpack.imageUrls.length;
    this.carouselIndex = (this.carouselIndex - 1 + len) % len;
  }

  nextImage(): void {
    if (!this.selectedBackpack) return;
    const len = this.selectedBackpack.imageUrls.length;
    this.carouselIndex = (this.carouselIndex + 1) % len;
  }

  goToImage(index: number): void {
    this.carouselIndex = index;
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
}
