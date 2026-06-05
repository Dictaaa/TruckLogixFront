import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({ providedIn: 'root' })
export class DialogService {

  constructor(private dialog: MatDialog) {}

  open<T, D = any, R = any>(
    component: ComponentType<T>,
    data?: D,
    config?: Partial<MatDialogConfig>
  ): MatDialogRef<T, R> {

    return this.dialog.open(component, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      height: 'auto',
      panelClass: 'dialog-panel',
      autoFocus: 'first-tabbable',
      restoreFocus: true,
      data,
      ...config
    });
  }
}