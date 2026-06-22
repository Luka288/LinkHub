import { ThemePreset } from '../themes/themes';
import { UserLink } from './user.type';

export interface PublicProfileResponse {
  user: PublicProfileInterface;
  links: UserLink[];
  preferences: ThemePreset;
}

export interface PublicProfileInterface {
  id: number;
  username: string;
  bio: string;
  avatar_url: null;
  preferences: ThemePreset;
}

export type PublicUserLink = Omit<UserLink, 'click_count' | 'user_id'>;
