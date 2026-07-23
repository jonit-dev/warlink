export interface Env {
  APP_ENV: string;
  ROOMS: DurableObjectNamespace;
  ZEROTIER_API_TOKEN: string;
  CONTROL_PLANE_SIGNING_KEY: string;
  OWNER_ENROLLMENT_SECRET: string;
}
