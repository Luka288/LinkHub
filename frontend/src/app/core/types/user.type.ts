export interface UserResponse {
  avatar_url: string | null;
  bio: string | null;
  email: string;
  id: number;
  username: string;
  links: UserLink[];
}

export interface UserLink {
  id: number;
  user_id: number;
  title: string;
  url: string;
  is_active: boolean;
  click_count: number;
  order_index: number;
  created_at: string;
  favicon_url: string;
}
