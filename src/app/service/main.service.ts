import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private snackBar: MatSnackBar) { }

  // Status bar that opens with success background
  openSuccessStatusBar(messageText: string) { // action: string
    this.snackBar.open(messageText, "OK", {
      duration: 3000,
      panelClass: ['green-snackbar', 'login-snackbar'],
    });
  }

  // Status bar that opens with error background
  openErrorStatusBar(messageText: string) {
    this.snackBar.open(messageText, "OK", {
      duration: 3000,
      panelClass: ['red-snackbar','login-snackbar'],
    });
  }

}
