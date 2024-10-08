/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent, readonly } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'qs' {
  export function parse(query: string | Record<string, any>, options?: any): Record<string, any>
  export function stringify(obj: Record<string, any>, options?: any): string
}

declare module 'js-cookie'
