export interface ISocialLink {
  platform: string;
  url: string;
  isActive: boolean;
}

export interface ISiteSetting {
  logo: string;
  socialLinks: ISocialLink[];
}
