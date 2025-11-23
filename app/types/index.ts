// --- START OF FILE index.ts ---

// 1. 指板音符定义
export interface Note {
  string: number;
  fret: number;
  root: boolean;
  label?: string;
}

// 2. 和弦相关定义 (新增)
export interface ChordBarre {
  fret: number;
  fromString: number;
  toString: number;
}

export interface Chord {
  name: string;
  subtitle?: string;
  frets: number[];    // [6弦, 5弦, ... 1弦]
  fingers?: number[]; // [6弦, 5弦, ... 1弦]
  barres?: ChordBarre[];
}

// 3. 内容块定义 (扩充)
export interface ContentBlock {
  // 新增 'chord-group' 和 'score' 类型
  type: "text" | "fretboard" | "chord-group" | "score"; 
  
  title?: string;
  
  // type: "text"
  text?: string; 
  
  // type: "fretboard"
  notes?: Note[]; 
  
  // type: "chord-group" (新增)
  chords?: Chord[]; 
  
  // type: "score" (新增，用于 AlphaTex)
  alphaTex?: string; 
}

// 4. 练习曲与课程定义
export interface Etude {
  title: string;
  tempo: number;
  audioSrc: string;
  gpFile: string;
}

export interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  content: ContentBlock[];
  etude?: Etude;
}