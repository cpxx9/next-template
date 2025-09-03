export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "BPGC";

export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "Website for CT's first golf club without real estate. Contact us, see our schedule, watch funny videos, and more!";

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 10;

export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(", ")
  : ["admin", "user"];
