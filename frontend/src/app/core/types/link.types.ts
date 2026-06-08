export interface CreateLinkPayload {
  title: string;
  url: string;
}

export interface UpdateLinkPayload {
  title?: string;
  url?: string;
  is_active?: boolean;
  id?: number;
  userId?: number;
}

export interface DeleteLinkPayload {
  id: number;
}
