import { UserLink } from './user.type';

export interface LinkModalData {
  kind: 'link';
  mode: 'create' | 'edit';
  link?: UserLink;
}

export interface ConfirmationModalData {
  kind: 'confirmation';
  message: string;
}

export type ModalData = LinkModalData | ConfirmationModalData;
