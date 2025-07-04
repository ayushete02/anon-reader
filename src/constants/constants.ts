// NearAI API Configuration
export const NEAR_AI_CONFIG = {
  API_URL: "https://api.near.ai/v1/chat/completions",
  IMAGE_API_URL: "https://api.near.ai/v1/images/generations",
  AUTH_HEADER: {
    "Content-Type": "application/json",
    Authorization:
      'Bearer {"account_id":"rishhh.near","public_key":"ed25519:7fgx6fVS7SixNi1PEF6UG3C7fiUDQUPXuh9oCRhkwmCh","signature":"YghVrPYlxcAB+OeYk8iB6amD1wwed5YZIY4Uxsfa7WWCg+n7wMCFwrRO5kd5EqevFtt81126zp0LpuAukfdHCA==","nonce":"1749832648115","recipient":"ai.near","message":"Welcome to NEAR AI","on_behalf_of":null}',
  },
  MODEL: "fireworks::accounts/fireworks/models/deepseek-v3",
  IMAGE_MODEL:
    "fireworks::accounts/fireworks/models/playground-v2-1024px-aesthetic",
  PROVIDER: "fireworks",
  MAX_TOKENS: 8192,
  TEMPERATURE: 1,
  STREAM: true,
  TIMEOUT: 60000,
} as const;

// Story Generation Configuration
export const STORY_CONFIG = {
  CHAPTERS_COUNT: 1,
  WORDS_PER_CHAPTER: 175,
  WORDS_PER_MINUTE: 200,
  DEFAULT_READING_TIME: 30,
  MIN_CHAPTER_NUMBER: 1,
  MAX_CHAPTER_NUMBER: 15,
} as const;

// Field Length Constraints
export const FIELD_CONSTRAINTS = {
  STORY_TITLE_MAX: 255,
  STORY_DESCRIPTION_MAX: 2048,
  STORY_PLOT_MAX: 2000,
  CHARACTER_NAME_MAX: 128,
  CHARACTER_DESCRIPTION_MAX: 2048,
  CHAPTER_TITLE_MAX: 255,
  CHAPTER_CONTENT_MAX: 4000,
} as const;
