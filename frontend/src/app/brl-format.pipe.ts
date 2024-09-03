import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'brlFormat',
  standalone: true
})
export class BrlFormatPipe implements PipeTransform {

  transform(value: number, currencyCode: string = 'BRL', displaySymbol: boolean = true): string {
    if (value === null || value === undefined) {
      return '';
    }

    const currencyFormatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: displaySymbol ? 'symbol' : 'code',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return currencyFormatter.format(value);
  }
}
