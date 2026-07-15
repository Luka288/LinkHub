export interface NavInterface {
  title: string;
  route: string;
  icon: string;
  target?: TargetType;
}

export type TargetType = '_blank' | '_self';
