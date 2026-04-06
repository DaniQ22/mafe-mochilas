import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Backpack } from '../models/image.model';
import { AuthService } from './auth.service';

export interface CreateBackpackPayload {
  name: string;
  description?: string;
  price?: number | null;
  images: File[];
}

@Injectable({
  providedIn: 'root',
})
export class BackpacksService {
  private readonly apiBaseUrl = 'https://mochilasmafe-back.onrender.com';
  private readonly backpacksUrl = `${this.apiBaseUrl}/api/backpacks`;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
  ) {}

  getBackpacks(): Observable<Backpack[]> {
    return this.http.get<Backpack[]>(this.backpacksUrl).pipe(
      map((backpacks) =>
        backpacks.map((backpack) => ({
          ...backpack,
          imageUrls: backpack.imageUrls.map((url) =>
            this.toAbsoluteImageUrl(url),
          ),
        })),
      ),
    );
  }

  deleteBackpack(id: string): Observable<void> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token ?? ''}` });
    return this.http.delete<void>(`${this.backpacksUrl}/${id}`, { headers });
  }

  createBackpack(payload: CreateBackpackPayload): Observable<Backpack> {
    const formData = new FormData();
    formData.append('name', payload.name);

    payload.images.forEach((file) => formData.append('images', file));

    if (payload.description && payload.description.trim().length > 0) {
      formData.append('description', payload.description.trim());
    }

    if (payload.price !== undefined && payload.price !== null) {
      formData.append('price', String(payload.price));
    }

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`,
    });

    return this.http.post<Backpack>(this.backpacksUrl, formData, { headers }).pipe(
      map((backpack) => ({
        ...backpack,
        imageUrls: backpack.imageUrls.map((url) =>
          this.toAbsoluteImageUrl(url),
        ),
      })),
    );
  }

  private toAbsoluteImageUrl(imageUrl: string): string {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    return `${this.apiBaseUrl}${imageUrl}`;
  }
}
