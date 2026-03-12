/**
 * Types TypeScript Strapi pour Next.js
 * 
 * ⚠️  FICHIER AUTO-GÉNÉRÉ - NE PAS MODIFIER
 * 
 * Ce fichier est synchronisé depuis strapi-base/types/strapi-types.d.ts
 * Pour mettre à jour:
 *   1. Depuis strapi-base: npm run generate:types
 *   2. Depuis strapi-base: npm run sync:types
 *   
 * Ou depuis nextjs-base: npm run sync:types
 */

// ============================================================================
// TYPES DE BASE STRAPI
// ============================================================================

export type StrapiID = number;
export type StrapiDateTime = string;
export type StrapiFileUrl = string;
export type StrapiJSON = Record<string, unknown>;

export interface StrapiMedia {
  id: StrapiID;
  url: StrapiFileUrl;
  mime?: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  };
  [key: string]: unknown;
}

export interface StrapiMediaFormat {
  url: StrapiFileUrl;
  width: number;
  height: number;
  mime: string;
  [key: string]: unknown;
}

export interface StrapiBlock {
  type: string;
  children?: Array<{
    type: string;
    text?: string;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

// ============================================================================
// TYPES D'ENVELOPPE STRAPI V5
// ============================================================================

// Strapi v5 : les données sont retournées directement (plus d'attributes)
export interface StrapiEntity {
  id: StrapiID;
  documentId: string;
}

export interface StrapiResponse<T> {
  data: (T & StrapiEntity) | null;
  meta: Record<string, unknown>;
}

export interface StrapiCollectionResponse<T> {
  data: Array<T & StrapiEntity>;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiErrorResponse {
  error: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Component: blocks.background-block
 */
export interface BackgroundBlock {
  type: string;
  color?: string;
  gradient?: string;
  image?: StrapiMedia;
  imageDesktop?: StrapiMedia;
  position?: string;
  size?: string;
  repeat?: string;
  fixed?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  scope?: string;
}

/**
 * Component: blocks.button-block
 */
export interface ButtonBlock {
  buttons: Button[];
  alignment: string;
  layout?: string;
  equalWidth?: boolean;
}

/**
 * Component: blocks.cards-block
 */
export interface CardsBlock {
  cards: (Card & StrapiEntity)[];
  columns: string;
  alignment: string;
  overlap?: boolean;
}

/**
 * Component: blocks.contact-form-block
 */
export interface ContactFormBlock {
  title?: string;
  description?: string;
  submitButtonText?: string;
  namePlaceholder?: string;
  emailPlaceholder?: string;
  messagePlaceholder?: string;
  nameLabel?: string;
  emailLabel?: string;
  messageLabel?: string;
  consentText?: string;
  policyLinkText?: string;
  successMessage?: string;
  errorMessage?: string;
  submittingText?: string;
  rgpdInfoText?: string;
  consentRequiredText?: string;
  privacyPolicy?: (PrivacyPolicy & StrapiEntity);
  blockAlignment: string;
  maxWidth: string;
}

/**
 * Component: blocks.hero-block-simple-text
 */
export interface HeroBlockSimpleText {
  title?: string;
  content: string;
  height: string;
  textAlignment: string;
}

/**
 * Component: blocks.image-block
 */
export interface ImageBlock {
  image: StrapiMedia;
  caption?: string;
  alignment: string;
  size: string;
}

/**
 * Component: blocks.reservation-block
 */
export interface ReservationBlock {
  title?: string;
  subtitle?: string;
  description?: string;
  submitLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  submittingText?: string;
  firstNameLabel?: string;
  lastNameLabel?: string;
  phoneLabel?: string;
  emailLabel?: string;
  dateLabel?: string;
  timeLabel?: string;
  coversLabel?: string;
  messageLabel?: string;
  firstNamePlaceholder?: string;
  lastNamePlaceholder?: string;
  phonePlaceholder?: string;
  emailPlaceholder?: string;
  messagePlaceholder?: string;
  consentText?: string;
  policyLinkText?: string;
  consentRequiredText?: string;
  rgpdInfoText?: string;
  minAdvanceDays?: number;
  maxAdvanceDays?: number;
  lunchStart?: string;
  lunchEnd?: string;
  dinnerStart?: string;
  dinnerEnd?: string;
  minCovers?: number;
  maxCovers?: number;
  privacyPolicy?: (PrivacyPolicy & StrapiEntity);
  blockAlignment: string;
  maxWidth: string;
}

/**
 * Component: blocks.text-block
 */
export interface TextBlock {
  content: StrapiBlock[];
  textAlignment: string;
  blockAlignment: string;
  maxWidth: string;
}

/**
 * Component: blocks.text-image-block
 */
export interface TextImageBlock {
  content: StrapiBlock[];
  image: StrapiMedia;
  imagePosition: string;
  imageSize: string;
  verticalAlignment: string;
  textAlignment: string;
  roundedImage?: boolean;
}

/**
 * Component: blocks.text-map-block
 */
export interface TextMapBlock {
  title?: string;
  content: StrapiBlock[];
  address: string;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  showMarker?: boolean;
  showItineraryLink?: boolean;
  showOpeningHours?: boolean;
  openingHoursTitle?: string;
  openingHoursClosedLabel?: string;
  openingDays?: OpeningDay[];
  openingHoursFirstPeriodLabel?: string;
  openingHoursSecondPeriodLabel?: string;
  itineraryLinkLabel?: string;
  markerImage?: StrapiMedia;
}

/**
 * Component: blocks.work-block
 */
export interface WorkBlock {
  filterByCategories?: (WorkCategory & StrapiEntity)[];
  showAllCategories?: boolean;
  showFeaturedOnly?: boolean;
  limit?: number;
  columns: string;
  showFilters?: boolean;
  layout?: string;
}

/**
 * Component: shared.button
 */
export interface Button {
  label: string;
  url?: string;
  file?: StrapiMedia;
  variant: string;
  isExternal?: boolean;
  icon?: string;
}

/**
 * Component: shared.carousel-card
 */
export interface CarouselCard {
  frontTitle: string;
  frontContent?: StrapiBlock[];
  backContent?: StrapiBlock[];
  image?: StrapiMedia;
}

/**
 * Component: shared.external-link
 */
export interface ExternalLink {
  url: string;
  label?: string;
}

/**
 * Component: shared.opening-day
 */
export interface OpeningDay {
  dayLabel: string;
  isClosedAllDay?: boolean;
  firstPeriodOpenTime?: string;
  firstPeriodCloseTime?: string;
  secondPeriodOpenTime?: string;
  secondPeriodCloseTime?: string;
}

/**
 * Component: shared.opening-hour
 */
export interface OpeningHour {
  dayLabel: string;
  openTime?: string;
  closeTime?: string;
  isClosed?: boolean;
}

/**
 * Component: shared.page-link
 */
export interface PageLink {
  page?: (Page & StrapiEntity);
  customLabel?: string;
  section?: (Section & StrapiEntity);
}

/**
 * Component: shared.timeline-image
 */
export interface TimelineImage {
  image: StrapiMedia;
  link?: ExternalLink;
}

/**
 * Component: shared.timeline-item
 */
export interface TimelineItem {
  title: string;
  date?: string;
  description?: string;
  images?: TimelineImage[];
}

// ============================================================================
// CONTENT TYPES
// ============================================================================

/**
 * Blocked Slot
 */
export interface BlockedSlot {
  date: string;
  time?: string;
  label?: string;
}
export type BlockedSlotResponse = StrapiResponse<BlockedSlot>;
export type BlockedSlotCollectionResponse = StrapiCollectionResponse<BlockedSlot>;

/**
 * card
 */
export interface Card {
  title?: string;
  subtitle?: string;
  content?: StrapiBlock[];
  image?: StrapiMedia;
  mobileImage?: StrapiMedia;
  locale?: string;
  localizations?: (Card & StrapiEntity)[];
}
export type CardResponse = StrapiResponse<Card>;
export type CardCollectionResponse = StrapiCollectionResponse<Card>;

/**
 * Header
 */
export interface Header {
  variant?: string;
  logo?: StrapiMedia;
  title?: string;
  navigation?: PageLink[];
  hideLanguageSwitcher?: boolean;
  locale?: string;
  localizations?: (Header & StrapiEntity)[];
}
export type HeaderResponse = StrapiResponse<Header>;
export type HeaderCollectionResponse = StrapiCollectionResponse<Header>;

/**
 * Legal Notice
 */
export interface LegalNotice {
  title: string;
  content: string;
  closeButtonText?: string;
  lastUpdated?: string;
  locale?: string;
  localizations?: (LegalNotice & StrapiEntity)[];
}
export type LegalNoticeResponse = StrapiResponse<LegalNotice>;
export type LegalNoticeCollectionResponse = StrapiCollectionResponse<LegalNotice>;

/**
 * page
 */
export interface Page {
  title?: string;
  hideTitle?: boolean;
  slug: string;
  sections?: (Section & StrapiEntity)[];
  seoTitle?: string;
  seoDescription?: StrapiBlock[];
  seoImage?: StrapiMedia;
  noIndex?: boolean;
  locale?: string;
  localizations?: (Page & StrapiEntity)[];
}
export type PageResponse = StrapiResponse<Page>;
export type PageCollectionResponse = StrapiCollectionResponse<Page>;

/**
 * Privacy Policy
 */
export interface PrivacyPolicy {
  title: string;
  content: string;
  closeButtonText?: string;
  lastUpdated?: string;
  locale?: string;
  localizations?: (PrivacyPolicy & StrapiEntity)[];
}
export type PrivacyPolicyResponse = StrapiResponse<PrivacyPolicy>;
export type PrivacyPolicyCollectionResponse = StrapiCollectionResponse<PrivacyPolicy>;

/**
 * Reservation
 */
export interface Reservation {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  covers: number;
  message?: string;
  status: string;
  customerLocale: string;
}
export type ReservationResponse = StrapiResponse<Reservation>;
export type ReservationCollectionResponse = StrapiCollectionResponse<Reservation>;

/**
 * Reservation Config
 */
export interface ReservationConfig {
  maxCoversPerSlot: number;
}
export type ReservationConfigResponse = StrapiResponse<ReservationConfig>;
export type ReservationConfigCollectionResponse = StrapiCollectionResponse<ReservationConfig>;

/**
 * section
 */
export interface Section {
  title?: string;
  identifier: string;
  hideTitle?: boolean;
  blocks: unknown[];
  order: number;
  spacingTop?: string;
  spacingBottom?: string;
  containerWidth?: string;
  locale?: string;
  localizations?: (Section & StrapiEntity)[];
}
export type SectionResponse = StrapiResponse<Section>;
export type SectionCollectionResponse = StrapiCollectionResponse<Section>;

/**
 * Work Category
 */
export interface WorkCategory {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: StrapiMedia;
  work_items?: (WorkItem & StrapiEntity)[];
  locale?: string;
  localizations?: (WorkCategory & StrapiEntity)[];
}
export type WorkCategoryResponse = StrapiResponse<WorkCategory>;
export type WorkCategoryCollectionResponse = StrapiCollectionResponse<WorkCategory>;

/**
 * Work Item
 */
export interface WorkItem {
  title: string;
  slug: string;
  description?: StrapiBlock[];
  shortDescription?: string;
  image: StrapiMedia;
  gallery?: StrapiMedia[];
  categories?: (WorkCategory & StrapiEntity)[];
  link?: string;
  client?: string;
  year?: number;
  technologies?: Record<string, unknown>;
  customFields?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  featured?: boolean;
  order?: number;
  locale?: string;
  localizations?: (WorkItem & StrapiEntity)[];
}
export type WorkItemResponse = StrapiResponse<WorkItem>;
export type WorkItemCollectionResponse = StrapiCollectionResponse<WorkItem>;
