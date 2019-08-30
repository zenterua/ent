import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appTariffName'
})
export class AppTariffNamePipe implements PipeTransform {

  transform(value: any): string {
    let tariffName;
    if ( !value ) {
      return value;
    }
    if ( value.TRFF_NO === 'SCE 8' && value.COMPANY === 'SOCAN' || value.TRFF_NO === 'SCE 5B' && value.COMPANY === 'RESOUND' ) {
      tariffName =  '8/5B';
    }
    if ( value.TRFF_NO === 'SCE 5B' && value.COMPANY === 'SOCAN' ) {
      tariffName =  '5B';
    }
    if ( value.TRFF_NO === 'SCE 4A1' ) {
      tariffName =  '4A15J';
    }
    if ( value.TRFF_NO === 'SCE 10B' ) {
      tariffName =  '10B/5F';
    }
    if ( value.TRFF_NO === 'SCE 10A' ) {
      tariffName =  '10A5G';
    }
    if (value.TRFF_NO === 'SCE 11B' ) {
      tariffName = '11B5I';
    }
    if ( value.TRFF_NO === 'SCE 4B1' ) {
      tariffName =  '4B1';
    }
    if ( value.TRFF_NO === 'SCE 9' ) {
      tariffName = '9/5H';
    }
    if ( value.TRFF_NO === 'SCE 11A' ) {
      tariffName = '11A/5E';
    }
    // tariffs not implemented
    if ( value.TRFF_NO === 'SCE 12A' ) {
      tariffName = '12A';
    }
    if ( value.TRFF_NO === 'SCE 13B' ) {
      tariffName = '13B';
    }
    if ( value.TRFF_NO === 'SCE 13C' ) {
      tariffName = '13C';
    }
    if ( value.TRFF_NO === 'SCE 15A' ) {
      tariffName = '15A';
    }
    if ( value.TRFF_NO === 'SCE 15B' ) {
      tariffName = '15B';
    }
    if ( value.TRFF_NO === 'SCE 18' ) {
      tariffName = '18';
    }
    if ( value.TRFF_NO === 'SCE 20' ) {
      tariffName = '20';
    }
    if ( value.TRFF_NO === 'SCE 21' ) {
      tariffName = '21';
    }
    if ( value.TRFF_NO === 'SCE 3A' ) {
      tariffName = '3A';
    }
    if ( value.TRFF_NO === 'SCE 3B' ) {
      tariffName = '3B';
    }
    if ( value.TRFF_NO === 'SCE 3C' ) {
      tariffName = '3C';
    }
    if ( value.TRFF_NO === 'SCE 4A2' ) {
      tariffName = '4A2';
    }
    if ( value.TRFF_NO === 'SCE 4B2' ) {
      tariffName = '4B2';
    }
    if ( value.TRFF_NO === 'SCE 4B3' ) {
      tariffName = '4B3';
    }
    if ( value.TRFF_NO === 'SCE 5A' ) {
      tariffName = '5A';
    }
    if ( value.TRFF_NO === 'SCE 6' ) {
      tariffName = '6';
    }
    if ( value.TRFF_NO === 'SCE 7' ) {
      tariffName = '7';
    }
    return tariffName;
  }

}
