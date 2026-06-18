import { ResolveFn } from '@angular/router';

export const TitleResolver: ResolveFn<string> = (route) => {
  const username = route.paramMap.get('username');
  return `LinkHub | @${username}`;
};
