/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/ErrorCheck` | `/Services/SupabaseService` | `/_sitemap` | `/screens/NewClientForm`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
