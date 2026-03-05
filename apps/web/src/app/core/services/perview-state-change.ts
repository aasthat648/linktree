import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PreviewStateService {
  private previewData = new BehaviorSubject<any>(null);

  preview$ = this.previewData.asObservable();

  setPreview(data: any) {
    this.previewData.next(data);
  }
}
