import { MatSnackBar } from "@angular/material/snack-bar";

export function openSnackBar(snackbar: MatSnackBar, message: string | undefined | null) {
  if (message && snackbar) {
    snackbar.open(message, "Fechar", {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000,
      panelClass: ["snackbar"],
    });
  }
}