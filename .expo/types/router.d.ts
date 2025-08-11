/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/ErrorCheck` | `/Services/SupabaseService` | `/_sitemap` | `/hooks/useLanguage` | `/i18n` | `/screens/NewClientForm` | `/screens/NewPetForm`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
