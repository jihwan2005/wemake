export interface Lesson {
  lesson_id: string;
  title: string | null;
  is_completed: boolean | null;
}

export interface Chapter {
  chapter_id: string;
  title: string | null;
  class_post_id: number;
  class_chapter_lesson: Lesson[];
}

export function calculateProgress(chapters: Chapter[]): number {
  const allLessons = chapters.flatMap(
    (chapter) => chapter.class_chapter_lesson
  );
  const completedLessons = allLessons.filter((lesson) => lesson.is_completed);
  const total = allLessons.length;
  const completed = completedLessons.length;
  return total === 0 ? 0 : Math.round((completed / total) * 100);
}
