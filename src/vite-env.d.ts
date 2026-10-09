/// <reference types="vite/client" />

interface ViteTypeOptions {
  /**
   * Отключает «резиновый» индексный ключ в `import.meta.env`:
   * опечатка в имени переменной становится ошибкой компиляции.
   */
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  /**
   * Отладочный переключатель этапа, работает независимо от дат турнира:
   * `VITE_PREVIEW_STEP=1…3` — общая сетка, `=4` — плей-офф,
   * `=done` — заглушка «турнир окончен».
   */
  readonly VITE_PREVIEW_STEP?: string;

  /**
   * Дополнительные Host для dev-сервера (превью за прокси),
   * например `VITE_ALLOWED_HOSTS=".e2b.app"`.
   */
  readonly VITE_ALLOWED_HOSTS?: string;
}
