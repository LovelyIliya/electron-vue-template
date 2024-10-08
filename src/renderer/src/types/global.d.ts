import type { CSSProperties } from 'vue'
import { RawAxiosRequestHeaders } from 'axios'
declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

  interface Fn<T = any> {
    (...arg: T[]): T
  }

  type Nullable<T> = T | null

  type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

  type Recordable<T = any, K extends string | number | symbol = string> = Record<
    K extends null | undefined ? string : K,
    T
  >

  type RemoveReadonly<T> = {
    -readonly [P in keyof T]: T[P]
  }

  type ComponentRef<T extends abstract new (...args: any) => any> = InstanceType<T>

  type TimeoutHandle = ReturnType<typeof setTimeout>
  type IntervalHandle = ReturnType<typeof setInterval>

  type AxiosContentType =
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'text/plain'

  type AxiosMethod = 'get' | 'post' | 'delete' | 'put'

  type AxiosResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

  interface AxiosConfig {
    params?: any
    data?: any
    url?: string
    method?: AxiosMethod
    headers?: RawAxiosRequestHeaders
    responseType?: AxiosResponseType
  }

  interface IResponse<T = any> {
    code: number
    data: T extends any ? T : T & any
  }
}
