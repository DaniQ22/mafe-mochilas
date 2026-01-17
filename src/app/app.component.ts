import { Component } from '@angular/core';
import { GalleryImage } from './core/models/image.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  selectedImage: GalleryImage | null = null;
  whatsappNumber = '573012098987'; // Cambia este número
  whatsappMessage = 'Hola! Me gustaría información sobre las mochilas 🎒';

  galleryImages: GalleryImage[] = [

    { id: 1, name: 'Mochila Rosé', color: 'bg-gradient-to-br from-pink-200 to-pink-300', imageUrl: 'assets/images/image-1.jpg' },
    { id: 2, name: 'Mochila Luna', color: 'bg-gradient-to-br from-purple-200 to-purple-300', imageUrl: 'assets/images/image-2.jpg' },
    { id: 3, name: 'Mochila Aurora', color: 'bg-gradient-to-br from-blue-200 to-blue-300', imageUrl: 'assets/images/image-3.jpg' },
    { id: 4, name: 'Mochila Coral', color: 'bg-gradient-to-br from-rose-200 to-rose-300', imageUrl: 'assets/images/image-4.jpg' },
    { id: 5, name: 'Mochila Lavanda', color: 'bg-gradient-to-br from-indigo-200 to-indigo-300', imageUrl: 'assets/images/image-5.jpg' },
    { id: 6, name: 'Mochila Sunset', color: 'bg-gradient-to-br from-orange-200 to-pink-300', imageUrl: 'assets/images/image-5.jpg' }
  ];

  features = [
    { emoji: '✨', title: 'Diseños Únicos', desc: 'Cada mochila es única y especial' },
    { emoji: '💝', title: 'Hecho con Amor', desc: 'Dedicación en cada puntada' },
    { emoji: '🎨', title: 'Personalizables', desc: 'Adaptamos el diseño a tu estilo' }
  ];

  openWhatsApp(): void {
    const url = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(this.whatsappMessage)}`;
    window.open(url, '_blank');
  }

  selectImage(image: GalleryImage): void {
    this.selectedImage = image;
  }

  closeModal(): void {
    this.selectedImage = null;
  }

}
