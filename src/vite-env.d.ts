interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_PREVIEW_STEP?: string;
  readonly VITE_ALLOWED_HOSTS?: string;
  readonly VITE_SITE_URL?: string;
}
