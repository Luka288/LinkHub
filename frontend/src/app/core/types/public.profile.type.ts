import { UserLink } from './user.type';

export interface PublicProfileResponse {
  user: PublicProfileInterface;
  links: UserLink[];
}

export interface PublicProfileInterface {
  id: number;
  username: string;
  bio: string;
  avatar_url: null;
}
