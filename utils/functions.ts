import * as CryptoJS from 'crypto-js';

export function encodeNumber(
  numberToEncode: number,
  secretKey: string
): string {
  const encodedString = CryptoJS.AES.encrypt(
    numberToEncode.toString(),
    secretKey
  ).toString();
  return encodedString;
}

export function decodeNumber(encodedString: string, secretKey: string): number {
  const bytes = CryptoJS.AES.decrypt(encodedString, secretKey);
  const decodedNumber = parseInt(bytes.toString(CryptoJS.enc.Utf8), 10);
  return decodedNumber;
}

export function generateIndex(start: number, end: number): number {
  if (start > end) {
    throw new Error('Start value must be less than or equal to end value');
  }

  const randomIndex = Math.floor(Math.random() * (end - start + 1)) + start;
  return randomIndex;
}

export type SeasonType = 'Winter' | 'Summer' | 'Spring' | 'Autumn';
export type StatusType =
  | 'Ongoing'
  | 'Completed'
  | 'Unknown'
  | 'Not yet aired'
  | 'Hiatus'
  | 'Cancelled';

export function generateColorBySeason(season: SeasonType) {
  let color: string;
  switch (season) {
    case 'Winter':
      color = '#b4e0db';
      break;
    case 'Summer':
      color = '#e0b4b4';
      break;
    case 'Autumn':
      color = '#f2baa7';
      break;
    case 'Spring':
      color = '#e8b7e5';
      break;
    default:
      color = '#b4e0db';
      break;
  }

  return color;
}

export function generateColorByStatus(status: StatusType) {
  let color: string;
  switch (status) {
    case 'Completed':
      color = '#b4e0db';
      break;
    case 'Cancelled':
      color = '#e0b4b4';
      break;
    case 'Unknown':
      color = '#f2baa7';
      break;
    case 'Hiatus':
      color = '#e8b7e5';
      break;
    case 'Ongoing':
      color = '#8fdbb9';
      break;
    case 'Not yet aired':
      color = '#bddb8f';
      break;
    default:
      color = '#b4e0db';
      break;
  }

  return color;
}
