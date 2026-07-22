import { ThemePreset } from '@linkhub/shared';
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
  is_public: boolean;
  display_name: string;
}

export type PublicUserLink = Omit<UserLink, 'click_count' | 'user_id'>;
