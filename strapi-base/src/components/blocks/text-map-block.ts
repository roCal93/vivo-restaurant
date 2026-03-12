export default {
  "collectionName": "components_blocks_text_map_blocks",
  "info": {
    "displayName": "Text + Map Block",
    "description": "Bloc deux colonnes : titre + texte et carte. Adresse configurable depuis Strapi"
  },
  "options": {},
  "attributes": {
    "title": {
      "type": "string"
    },
    "content": {
      "type": "blocks",
      "required": true
    },
    "address": {
      "type": "string",
      "required": true
    },
    "latitude": {
      "type": "decimal"
    },
    "longitude": {
      "type": "decimal"
    },
    "zoom": {
      "type": "integer",
      "default": 15
    },
    "showMarker": {
      "type": "boolean",
      "default": true
    },
    "showItineraryLink": {
      "type": "boolean",
      "default": true
    },
    "showOpeningHours": {
      "type": "boolean",
      "default": false
    },
    "openingHoursTitle": {
      "type": "string",
      "default": "Horaires"
    },
    "openingHoursClosedLabel": {
      "type": "string",
      "default": "Fermé"
    },
    "openingDays": {
      "type": "component",
      "repeatable": true,
      "component": "shared.opening-day"
    },
    "openingHoursFirstPeriodLabel": {
      "type": "string",
      "default": "Service 1"
    },
    "openingHoursSecondPeriodLabel": {
      "type": "string",
      "default": "Service 2"
    },
    "itineraryLinkLabel": {
      "type": "string",
      "default": "Ouvrir dans Maps"
    },
    "markerImage": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": [
        "images"
      ]
    }
  },
  "config": {}
} as const;
