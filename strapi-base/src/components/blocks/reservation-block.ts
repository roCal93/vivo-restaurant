export default {
  "collectionName": "components_blocks_reservation_blocks",
  "info": {
    "displayName": "Reservation Block",
    "description": "Online reservation form for restaurants with date/time/covers picker"
  },
  "options": {},
  "attributes": {
    "title": {
      "type": "string",
      "default": "Réservez une table",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "subtitle": {
      "type": "string",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "description": {
      "type": "text",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "submitLabel": {
      "type": "string",
      "default": "Réserver",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "successMessage": {
      "type": "string",
      "default": "✓ Votre réservation a été envoyée avec succès ! Nous vous confirmerons par email.",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "errorMessage": {
      "type": "string",
      "default": "✗ Une erreur est survenue. Veuillez réessayer ou nous contacter par téléphone.",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "submittingText": {
      "type": "string",
      "default": "Envoi en cours...",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "firstNameLabel": {
      "type": "string",
      "default": "Prénom",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "lastNameLabel": {
      "type": "string",
      "default": "Nom",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "phoneLabel": {
      "type": "string",
      "default": "Téléphone",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "emailLabel": {
      "type": "string",
      "default": "Email",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "dateLabel": {
      "type": "string",
      "default": "Date",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "timeLabel": {
      "type": "string",
      "default": "Heure",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "coversLabel": {
      "type": "string",
      "default": "Nombre de couverts",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "messageLabel": {
      "type": "string",
      "default": "Message (optionnel)",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "firstNamePlaceholder": {
      "type": "string",
      "default": "Votre prénom",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "lastNamePlaceholder": {
      "type": "string",
      "default": "Votre nom",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "phonePlaceholder": {
      "type": "string",
      "default": "+33 6 12 34 56 78",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "emailPlaceholder": {
      "type": "string",
      "default": "votre@email.com",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "messagePlaceholder": {
      "type": "string",
      "default": "Occasion spéciale, allergies, demandes particulières...",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "consentText": {
      "type": "text",
      "default": "J'accepte que mes données personnelles soient traitées conformément à la",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "policyLinkText": {
      "type": "string",
      "default": "politique de confidentialité",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "consentRequiredText": {
      "type": "string",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "rgpdInfoText": {
      "type": "text",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "minAdvanceDays": {
      "type": "integer",
      "default": 1
    },
    "maxAdvanceDays": {
      "type": "integer",
      "default": 60
    },
    "lunchStart": {
      "type": "string",
      "default": "11:00"
    },
    "lunchEnd": {
      "type": "string",
      "default": "13:00"
    },
    "dinnerStart": {
      "type": "string",
      "default": "18:00"
    },
    "dinnerEnd": {
      "type": "string",
      "default": "20:00"
    },
    "minCovers": {
      "type": "integer",
      "default": 1
    },
    "maxCovers": {
      "type": "integer",
      "default": 20
    },
    "privacyPolicy": {
      "type": "relation",
      "relation": "oneToOne",
      "target": "api::privacy-policy.privacy-policy"
    },
    "blockAlignment": {
      "type": "enumeration",
      "enum": [
        "left",
        "center",
        "right",
        "full"
      ],
      "default": "center",
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "maxWidth": {
      "type": "enumeration",
      "enum": [
        "small",
        "medium",
        "large",
        "full"
      ],
      "default": "medium",
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    }
  },
  "config": {}
} as const;
