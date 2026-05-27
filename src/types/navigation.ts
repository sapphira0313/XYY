import { GROUP_SECTIONS } from '../data/navigation';

export type WebsiteType = typeof GROUP_SECTIONS[number]['id'];

export interface Website {
  id: string;
  name: string;
  url: string;
  icon: string;
  position?: number;
  type?: WebsiteType;
  sectionName?: string;
}

export interface WebsiteGroup {
  id: string;
  name: string;
  websites: Website[];
}

export interface SearchEngine {
  name: string;
  url: string;
  favicon: string;
}

export interface Wallpaper {
  url: string;
  copyright: string;
  date: string;
}