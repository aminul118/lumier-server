export interface ISocialLink {
  platform: string;
  url: string;
  isActive: boolean;
}

export interface ISiteSetting {
  logo: string;
  socialLinks: ISocialLink[];
  title?: string;
  description?: string;
  keywords?: string;
  baseImage?: string;
}
