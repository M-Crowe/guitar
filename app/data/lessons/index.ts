import lesson1 from './lesson-1.json';
import lesson2 from './lesson-2.json';
import type { Lesson } from '@/types';
import { asset } from '@/utils/path';

// 处理资源路径
const processLesson = (lesson: any): Lesson => ({
  ...lesson,
  etude: lesson.etude ? {
    ...lesson.etude,
    audioSrc: asset(lesson.etude.audioSrc),
    gpFile: asset(lesson.etude.gpFile),
  } : undefined,
});

export const lessons: Lesson[] = [
  processLesson(lesson1),
  processLesson(lesson2)
];

export const getLessonById = (id: number): Lesson | undefined => {
  return lessons.find(l => l.id === id);
};
