import Prism from 'prismjs';
import type { StrapiApp } from '@strapi/strapi/admin';

declare global {
  interface Window {
    Prism: typeof Prism;
  }
}

globalThis.Prism = Prism;

export default {
  config: {
    locales: [],
  },
  bootstrap(_app: StrapiApp) {},
};