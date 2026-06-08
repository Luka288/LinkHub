export interface CreateLinkPayload {
  title: string;
  url: string;
}

export interface UpdateLinkPayload {
  title: string;
  url: string;
  is_active: boolean;
  id: number;
}

export interface ToggleLinkPayload {
  id: number;
  userId: number;
  is_active: boolean;
}
