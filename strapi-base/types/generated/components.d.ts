import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksBackgroundBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_background_blocks';
  info: {
    description: 'Change le fond du site (couleur, image, gradient)';
    displayName: 'Background Block';
  };
  attributes: {
    color: Schema.Attribute.String;
    fixed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    gradient: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images' | 'files'>;
    imageDesktop: Schema.Attribute.Media<'images' | 'files'>;
    overlayColor: Schema.Attribute.String;
    overlayOpacity: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    position: Schema.Attribute.Enumeration<
      [
        'center center',
        'top center',
        'bottom center',
        'left center',
        'right center',
      ]
    > &
      Schema.Attribute.DefaultTo<'center center'>;
    repeat: Schema.Attribute.Enumeration<
      ['no-repeat', 'repeat', 'repeat-x', 'repeat-y']
    > &
      Schema.Attribute.DefaultTo<'no-repeat'>;
    scope: Schema.Attribute.Enumeration<['section', 'global']> &
      Schema.Attribute.DefaultTo<'section'>;
    size: Schema.Attribute.Enumeration<['cover', 'contain', 'auto']> &
      Schema.Attribute.DefaultTo<'cover'>;
    type: Schema.Attribute.Enumeration<['color', 'image', 'gradient']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'color'>;
  };
}

export interface BlocksButtonBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_button_blocks';
  info: {
    description: 'One or multiple buttons with alignment';
    displayName: 'Button Block';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<
      ['left', 'center', 'right', 'space-between']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'center'>;
    buttons: Schema.Attribute.Component<'shared.button', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    equalWidth: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    layout: Schema.Attribute.Enumeration<['horizontal', 'vertical']> &
      Schema.Attribute.DefaultTo<'horizontal'>;
  };
}

export interface BlocksCardsBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_cards_blocks';
  info: {
    description: 'Display a grid of cards';
    displayName: 'Cards Block';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'center'>;
    cards: Schema.Attribute.Relation<'oneToMany', 'api::card.card'> &
      Schema.Attribute.Required;
    columns: Schema.Attribute.Enumeration<['1', '2', '3', '4']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'3'>;
    overlap: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface BlocksContactFormBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_contact_form_blocks';
  info: {
    description: 'Contact form with name, email and message fields';
    displayName: 'Contact Form Block';
  };
  attributes: {
    blockAlignment: Schema.Attribute.Enumeration<
      ['left', 'center', 'right', 'full']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<'center'>;
    consentRequiredText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    consentText: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<"J'accepte que mes donn\u00E9es personnelles soient trait\u00E9es conform\u00E9ment \u00E0 la">;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    emailLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Votre email'>;
    emailPlaceholder: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'votre@email.com'>;
    errorMessage: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'\u2717 Une erreur est survenue. Veuillez r\u00E9essayer.'>;
    maxWidth: Schema.Attribute.Enumeration<
      ['small', 'medium', 'large', 'full']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<'medium'>;
    messageLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Votre message'>;
    messagePlaceholder: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Votre message...'>;
    nameLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Votre nom'>;
    namePlaceholder: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Votre nom'>;
    policyLinkText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'politique de confidentialit\u00E9'>;
    privacyPolicy: Schema.Attribute.Relation<
      'oneToOne',
      'api::privacy-policy.privacy-policy'
    >;
    rgpdInfoText: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    submitButtonText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Envoyer'>;
    submittingText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Envoi en cours...'>;
    successMessage: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'\u2713 Votre message a \u00E9t\u00E9 envoy\u00E9 avec succ\u00E8s !'>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Contactez-nous'>;
  };
}

export interface BlocksHeroBlockSimpleText extends Struct.ComponentSchema {
  collectionName: 'components_blocks_hero_block_simple_texts';
  info: {
    description: 'Hero section with optional title and text content';
    displayName: 'Hero Block Simple Text';
  };
  attributes: {
    content: Schema.Attribute.Text & Schema.Attribute.Required;
    height: Schema.Attribute.Enumeration<
      ['little', 'medium', 'large', 'full']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'large'>;
    textAlignment: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'center'>;
    title: Schema.Attribute.String;
  };
}

export interface BlocksImageBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_image_blocks';
  info: {
    description: 'Image with caption and alignment';
    displayName: 'Image Block';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<
      ['left', 'center', 'right', 'full']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'center'>;
    caption: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    size: Schema.Attribute.Enumeration<['small', 'medium', 'large', 'full']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'medium'>;
  };
}

export interface BlocksReservationBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_reservation_blocks';
  info: {
    description: 'Online reservation form for restaurants with date/time/covers picker';
    displayName: 'Reservation Block';
  };
  attributes: {
    blockAlignment: Schema.Attribute.Enumeration<
      ['left', 'center', 'right', 'full']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<'center'>;
    consentRequiredText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    consentText: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<"J'accepte que mes donn\u00E9es personnelles soient trait\u00E9es conform\u00E9ment \u00E0 la">;
    coversLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Nombre de couverts'>;
    dateLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Date'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    dinnerEnd: Schema.Attribute.String & Schema.Attribute.DefaultTo<'20:00'>;
    dinnerStart: Schema.Attribute.String & Schema.Attribute.DefaultTo<'18:00'>;
    emailLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Email'>;
    emailPlaceholder: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'votre@email.com'>;
    errorMessage: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'\u2717 Une erreur est survenue. Veuillez r\u00E9essayer ou nous contacter par t\u00E9l\u00E9phone.'>;
    firstNameLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Pr\u00E9nom'>;
    firstNamePlaceholder: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Votre pr\u00E9nom'>;
    lastNameLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Nom'>;
    lastNamePlaceholder: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Votre nom'>;
    lunchEnd: Schema.Attribute.String & Schema.Attribute.DefaultTo<'13:00'>;
    lunchStart: Schema.Attribute.String & Schema.Attribute.DefaultTo<'11:00'>;
    maxAdvanceDays: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<60>;
    maxCovers: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<20>;
    maxWidth: Schema.Attribute.Enumeration<
      ['small', 'medium', 'large', 'full']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<'medium'>;
    messageLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Message (optionnel)'>;
    messagePlaceholder: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Occasion sp\u00E9ciale, allergies, demandes particuli\u00E8res...'>;
    minAdvanceDays: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<1>;
    minCovers: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<1>;
    phoneLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'T\u00E9l\u00E9phone'>;
    phonePlaceholder: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'+33 6 12 34 56 78'>;
    policyLinkText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'politique de confidentialit\u00E9'>;
    privacyPolicy: Schema.Attribute.Relation<
      'oneToOne',
      'api::privacy-policy.privacy-policy'
    >;
    rgpdInfoText: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    submitLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'R\u00E9server'>;
    submittingText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Envoi en cours...'>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    successMessage: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'\u2713 Votre r\u00E9servation a \u00E9t\u00E9 envoy\u00E9e avec succ\u00E8s ! Nous vous confirmerons par email.'>;
    timeLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Heure'>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'R\u00E9servez une table'>;
  };
}

export interface BlocksTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_text_blocks';
  info: {
    description: 'Rich text content block';
    displayName: 'Text Block';
  };
  attributes: {
    blockAlignment: Schema.Attribute.Enumeration<
      ['left', 'center', 'right', 'full']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'full'>;
    content: Schema.Attribute.Blocks & Schema.Attribute.Required;
    maxWidth: Schema.Attribute.Enumeration<
      ['small', 'medium', 'large', 'full']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'full'>;
    textAlignment: Schema.Attribute.Enumeration<
      ['left', 'center', 'right', 'justify']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'left'>;
  };
}

export interface BlocksTextImageBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_text_image_blocks';
  info: {
    description: 'Combine text content with an image side by side';
    displayName: 'Text + Image Block';
  };
  attributes: {
    content: Schema.Attribute.Blocks & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    imagePosition: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'right'>;
    imageSize: Schema.Attribute.Enumeration<['small', 'medium', 'large']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'medium'>;
    roundedImage: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    textAlignment: Schema.Attribute.Enumeration<
      ['left', 'center', 'right', 'justify']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'left'>;
    verticalAlignment: Schema.Attribute.Enumeration<
      ['top', 'center', 'bottom']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'center'>;
  };
}

export interface BlocksTextMapBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_text_map_blocks';
  info: {
    description: 'Bloc deux colonnes : titre + texte et carte. Adresse configurable depuis Strapi';
    displayName: 'Text + Map Block';
  };
  attributes: {
    address: Schema.Attribute.String & Schema.Attribute.Required;
    content: Schema.Attribute.Blocks & Schema.Attribute.Required;
    itineraryLinkLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Ouvrir dans Maps'>;
    latitude: Schema.Attribute.Decimal;
    longitude: Schema.Attribute.Decimal;
    markerImage: Schema.Attribute.Media<'images'>;
    openingDays: Schema.Attribute.Component<'shared.opening-day', true>;
    openingHoursClosedLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Ferm\u00E9'>;
    openingHoursFirstPeriodLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Service 1'>;
    openingHoursSecondPeriodLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Service 2'>;
    openingHoursTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Horaires'>;
    showItineraryLink: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    showMarker: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showOpeningHours: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    title: Schema.Attribute.String;
    zoom: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<15>;
  };
}

export interface BlocksWorkBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_work_blocks';
  info: {
    description: 'Display work items (projects, case studies, services, etc.) with filtering by category';
    displayName: 'Work Block';
  };
  attributes: {
    columns: Schema.Attribute.Enumeration<['2', '3', '4']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'3'>;
    filterByCategories: Schema.Attribute.Relation<
      'oneToMany',
      'api::work-category.work-category'
    >;
    layout: Schema.Attribute.Enumeration<['grid', 'masonry', 'list']> &
      Schema.Attribute.DefaultTo<'grid'>;
    limit: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<12>;
    showAllCategories: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    showFeaturedOnly: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    showFilters: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface SharedButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_buttons';
  info: {
    description: 'Call-to-action button with customizable style and link';
    displayName: 'Button';
  };
  attributes: {
    file: Schema.Attribute.Media<'files' | 'images'>;
    icon: Schema.Attribute.String;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String;
    variant: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'outline', 'ghost']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface SharedCarouselCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_carousel_cards';
  info: {
    description: 'Card with front and back content for carousel';
    displayName: 'Carousel Card';
  };
  attributes: {
    backContent: Schema.Attribute.Blocks;
    frontContent: Schema.Attribute.Blocks;
    frontTitle: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedExternalLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_external_links';
  info: {
    description: 'A link to an external URL';
    displayName: 'External Link';
    icon: 'external-link-alt';
  };
  attributes: {
    label: Schema.Attribute.String;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedOpeningDay extends Struct.ComponentSchema {
  collectionName: 'components_shared_opening_days';
  info: {
    description: 'Horaires midi/soir pour un jour';
    displayName: 'Opening Day';
  };
  attributes: {
    dayLabel: Schema.Attribute.String & Schema.Attribute.Required;
    firstPeriodCloseTime: Schema.Attribute.String;
    firstPeriodOpenTime: Schema.Attribute.String;
    isClosedAllDay: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    secondPeriodCloseTime: Schema.Attribute.String;
    secondPeriodOpenTime: Schema.Attribute.String;
  };
}

export interface SharedOpeningHour extends Struct.ComponentSchema {
  collectionName: 'components_shared_opening_hours';
  info: {
    description: "Ligne d'horaires d'ouverture";
    displayName: 'Opening Hour';
  };
  attributes: {
    closeTime: Schema.Attribute.String;
    dayLabel: Schema.Attribute.String & Schema.Attribute.Required;
    isClosed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    openTime: Schema.Attribute.String;
  };
}

export interface SharedPageLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_page_links';
  info: {
    description: 'Link to a page with automatic slug resolution';
    displayName: 'page-link';
  };
  attributes: {
    customLabel: Schema.Attribute.String;
    page: Schema.Attribute.Relation<'oneToOne', 'api::page.page'>;
    section: Schema.Attribute.Relation<'oneToOne', 'api::section.section'>;
  };
}

export interface SharedTimelineImage extends Struct.ComponentSchema {
  collectionName: 'components_shared_timeline_images';
  info: {
    description: 'An image for the timeline with an optional external link';
    displayName: 'Timeline Image';
    icon: 'image';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    link: Schema.Attribute.Component<'shared.external-link', false>;
  };
}

export interface SharedTimelineItem extends Struct.ComponentSchema {
  collectionName: 'components_common_timeline_items';
  info: {
    description: 'A single item/step in the timeline.';
    displayName: 'Timeline Item';
    icon: 'dot-circle';
  };
  attributes: {
    date: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    images: Schema.Attribute.Component<'shared.timeline-image', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.background-block': BlocksBackgroundBlock;
      'blocks.button-block': BlocksButtonBlock;
      'blocks.cards-block': BlocksCardsBlock;
      'blocks.contact-form-block': BlocksContactFormBlock;
      'blocks.hero-block-simple-text': BlocksHeroBlockSimpleText;
      'blocks.image-block': BlocksImageBlock;
      'blocks.reservation-block': BlocksReservationBlock;
      'blocks.text-block': BlocksTextBlock;
      'blocks.text-image-block': BlocksTextImageBlock;
      'blocks.text-map-block': BlocksTextMapBlock;
      'blocks.work-block': BlocksWorkBlock;
      'shared.button': SharedButton;
      'shared.carousel-card': SharedCarouselCard;
      'shared.external-link': SharedExternalLink;
      'shared.opening-day': SharedOpeningDay;
      'shared.opening-hour': SharedOpeningHour;
      'shared.page-link': SharedPageLink;
      'shared.timeline-image': SharedTimelineImage;
      'shared.timeline-item': SharedTimelineItem;
    }
  }
}
