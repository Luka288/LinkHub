import { HttpContextToken } from '@angular/common/http';

export const ENABLE_LOADING = new HttpContextToken<boolean>(() => false);
