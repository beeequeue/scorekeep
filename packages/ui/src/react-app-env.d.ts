/* eslint-disable no-unused-vars,import/export,import/no-default-export */

declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  type ProcessEnv = {
    NODE_ENV: 'development' | 'production' | 'test'
    PUBLIC_URL: string
    REACT_APP_SERVER_BASE_URL: string
    REACT_APP_STRIPE_CLIENT: string
  }
}

declare module '*.bmp' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

declare module '*.svg' {
  import { FC, SVGProps } from 'react'

  export const ReactComponent: FC<SVGProps<SVGSVGElement>>

  const src: string
  export default src
}

declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.module.sass' {
  const classes: { [key: string]: string }
  export default classes
}
