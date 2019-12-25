export enum AuthErrorCode {
  NO_CODE = 'NO_CODE',
  EMAIL_REQUIRED = 'EMAIL_REQUIRED',
  ANOTHER_USER = 'ANOTHER_USER',
}

export type JWTData = {
  session: string
  name: string
  image: string | null
}
