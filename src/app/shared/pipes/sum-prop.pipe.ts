import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sumProp', standalone: true })
export class SumPropPipe implements PipeTransform {
  transform(arr: any[], prop: string): number {
    return arr.reduce((s, item) => s + (item[prop] || 0), 0);
  }
}