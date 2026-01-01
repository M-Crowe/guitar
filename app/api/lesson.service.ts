import type { Lesson } from '../types';
import { lessons, getLessonById } from '../data/lessons';

export const lessonService = {
  getAllLessons: async (): Promise<Lesson[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return lessons;
  },

  getLessonById: async (id: number): Promise<Lesson | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return getLessonById(id);
  }
};
