import { MatSnackBar } from "@angular/material/snack-bar";

export function openSnackBar(snackbar: MatSnackBar, message: string | undefined | null) {
  if (message && snackbar) {
    if (typeof message != "string") {
      message = "Erro ao processar requisição.";
    }
    console.log(message);
    snackbar.open(message, "Fechar", {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000,
      panelClass: ["snackbar"],
    });
  }
}