/** Length caps applied to API request fields. UTF-16 code units (`String.length`). */
export const LIMIT_TOPIC_ID = 200;
export const LIMIT_MESSAGE = 32_000;
export const LIMIT_STUDENT_ANSWERS = 32_000;
/** Pasted readings / notes builder */
export const LIMIT_SOURCE_TEXT_NOTES = 150_000;
/** Optional extra context for flashcards */
export const LIMIT_SOURCE_TEXT_FLASHCARDS = 100_000;
export const LIMIT_QUIZ_MODE = 120;
export const LIMIT_QUIZ_COUNT = 40;
export const LIMIT_FLASHCARD_COUNT = 40;
export const LIMIT_STUDY_ACTION = 120;
export const LIMIT_ARTIFACT_TYPE = 500;
export const LIMIT_WEAK_TOPICS_COUNT = 100;
export const LIMIT_LESSON_STRING_ID = 200;
/** Raw `JSON.stringify(step)` before prompt truncation */
export const LIMIT_LESSON_STEP_JSON = 48_000;
