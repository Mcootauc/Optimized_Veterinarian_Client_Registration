# Internationalization (i18n) Setup

This app supports English and Mandarin (Chinese) languages using `react-i18next`.

## Files Structure

```
app/
├── locales/
│   ├── en.json          # English translations
│   ├── zh.json          # Mandarin translations
│   └── README.md        # This file
├── i18n.ts              # i18n configuration
├── hooks/
│   └── useLanguage.ts   # Custom language hook
└── index.tsx            # Home page with language switch
```

## How to Use

### 1. Using Translations in Components

```tsx
import { useLanguage } from './hooks/useLanguage';

export default function MyComponent() {
    const { t } = useLanguage();

    return <Text>{t('home.newClientRegistration')}</Text>;
}
```

### 2. Switching Languages

```tsx
import { useLanguage } from './hooks/useLanguage';

export default function MyComponent() {
    const { switchLanguage, setLanguage } = useLanguage();

    // Switch between English and Mandarin
    const handleSwitch = () => {
        switchLanguage();
    };

    // Set specific language
    const handleSetEnglish = () => {
        setLanguage('en');
    };

    const handleSetMandarin = () => {
        setLanguage('zh');
    };
}
```

### 3. Adding New Translations

1. Add the English text to `en.json`:

```json
{
    "newSection": {
        "newKey": "New English Text"
    }
}
```

2. Add the Mandarin translation to `zh.json`:

```json
{
    "newSection": {
        "newKey": "新的中文文本"
    }
}
```

3. Use in your component:

```tsx
const { t } = useLanguage();
<Text>{t('newSection.newKey')}</Text>;
```

## Language Persistence

The selected language is automatically saved to AsyncStorage and restored when the app restarts.

## Available Languages

-   `en` - English
-   `zh` - Mandarin (Chinese)

## Translation Keys

### Home Page (`home.*`)

-   `newClientRegistration` - "New Client Registration" / "新客户注册"
-   `newPetRegistration` - "New Pet Registration" / "新宠物注册"
-   `footer` - Copyright text
-   `languageSwitch` - Language switch button text

### Client Form (`clientForm.*`)

-   Form field labels and validation messages
-   Success/error messages
-   Button texts

### Pet Form (`petForm.*`)

-   Form field labels and navigation
-   Page titles and button texts
