// 1. 指板音符定义
export interface Note {
  string: number;
  fret: number;
  root: boolean;
  label?: string;
}

// 2. 和弦相关定义
export interface ChordBarre {
  fret: number;
  fromString: number;
  toString: number;
}

export interface Chord {
  name: string;
  subtitle?: string;
  frets: number[];
  fingers?: number[];
  barres?: ChordBarre[];
}

// 3. 内容块定义
export type ContentBlockType = 'text' | 'fretboard' | 'chord-group' | 'score';

export interface ContentBlock {
  type: ContentBlockType;
  title?: string;
  text?: string;
  notes?: Note[];
  chords?: Chord[];
  alphaTex?: string;
}

// 4. 课程元数据
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LessonMeta {
  difficulty: DifficultyLevel;
  duration?: number; // 预计学习时长（分钟）
  prerequisites: number[]; // 前置课程 ID
}

// 5. 练习曲定义
export interface Etude {
  title: string;
  description?: string;
  tempo: number;
  audioSrc: string;
  gpFile: string;
}

// 6. 课程定义
export interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  meta?: LessonMeta;
  content: ContentBlock[];
  etude?: Etude;
}