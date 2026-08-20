/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE?: string;
  readonly VITE_APP_VERSION?: string;
  readonly VITE_APP_DESCRIPTION?: string;
  readonly GEMINI_API_KEY?: string;
  readonly APP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
