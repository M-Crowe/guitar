// --- START OF FILE app/api/lesson.service.ts ---

import type { Lesson } from '../types'; // 确保路径指向你刚才修改的 index.ts

// ✅ 获取当前环境的基础路径
const BASE_URL = import.meta.env.BASE_URL;

/**
 * 路径拼接辅助函数
 */
const asset = (path: string) => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE_URL}${cleanPath}`;
};

const MOCK_LESSONS: Lesson[] = [
  {
    id: 1,
    title: "第 1 课",
    subtitle: "五声音阶与基础和弦 (The Scale & Chords)",
    description: "学习布鲁斯吉他的基石——小调五声音阶指型1，以及 I-IV-V 和弦进行。",
    tags: ["音阶", "五声音阶", "指型1", "布鲁斯和弦"],
    content: [
      // --- 1. 介绍文本 ---
      {
        type: "text",
        title: "介绍小调五声音阶",
        text: `音阶是音乐的基础。调由不同音阶中的音符定义。和弦由音阶中的音符构成。几乎与其他风格的音乐一样，布鲁斯风格吉他的旋律和连复段也是以音阶为基础的。\n\n此外，你的大部分演奏技巧都将源于日常的音阶练习。对指板知识的彻底掌握也是基于对音阶的理解。\n\n在布鲁斯中，我们首先关注“五声”（包含五个音符）音阶。在本书中，我们称之为 **“指型 1” (Pattern 1)**。\n\n“小调五声音阶”几乎是所有布鲁斯、“布鲁斯-摇滚”连复段的基础。这种音阶在吉他上有五个基本的指型。学会这五个指型后，你就能在“整个”指板上演奏。`
      },
      
      // --- 2. 指板图 (E小调五声音阶) ---
      {
        type: "fretboard",
        title: "E 小调五声音阶 - 指型 1 (空弦)",
        notes: [
          // 6弦 (E, G)
          { string: 6, fret: 0, root: true, label: 'E' }, { string: 6, fret: 3, root: false },
          // 5弦 (A, B)
          { string: 5, fret: 0, root: false }, { string: 5, fret: 2, root: false },
          // 4弦 (D, E)
          { string: 4, fret: 0, root: false }, { string: 4, fret: 2, root: true, label: 'E' },
          // 3弦 (G, A)
          { string: 3, fret: 0, root: false }, { string: 3, fret: 2, root: false },
          // 2弦 (B, D)
          { string: 2, fret: 0, root: false }, { string: 2, fret: 3, root: false },
          // 1弦 (E, G)
          { string: 1, fret: 0, root: true, label: 'E' }, { string: 1, fret: 3, root: false },
        ]
      },

      // --- 3. 练习指导 ---
      {
        type: "text",
        title: "练习要点",
        text: `• **每天练习** 此音阶 5-10 分钟，坚持一周；\n• 使用图示中给出的指法 (0代表空弦, 1代表食指, 2代表中指, 3代表无名指, 4代表小指)；\n• 练习时，要确保以一个非常均匀的速度慢慢地演奏它。使每个音符都清晰地发出声音；\n• 此时速度并不重要，**干净**最重要。`
      },

      // --- 4. 乐谱练习 (AlphaTex) ---
      {
        type: "score",
        title: "音阶练习谱 (上行与下行)",
        // AlphaTex 语法说明:
        // \tempo 80: 速度
        // :4 : 四分音符
        // 0.6 : 6弦空弦
        // 3.6 : 6弦3品
        // | : 小节线
        alphaTex: `
          \\tempo 80 
          .
          :4 
          0.6 3.6 0.5 2.5 | 0.4 2.4 0.3 2.3 | 0.2 3.2 0.1 3.1 | 
          3.1 0.1 3.2 0.2 | 2.3 0.3 2.4 0.4 | 2.5 0.5 3.6 0.6 | :2 0.6
        `
      },

      // --- 5. 布鲁斯应用与和弦 ---
      {
        type: "text",
        title: "布鲁斯应用：和弦及和弦进行",
        text: `大多数布鲁斯和弦进行都非常简单，只有三个和弦，它们有时候被称为“I (一)、IV (四)、V (五) 进行”。\n\nI 级和弦的名字与你演奏的调的名字相同。在 E 调中：\n• I 级和弦是 E\n• IV 级是 A\n• V 级是 B\n\n在布鲁斯中，通常使用 7 和弦 (E7, A7, B7) 给予了和弦更多的“色彩”。`
      },

      // --- 6. 和弦展示 (E7, A7, B7) ---
      {
        type: "chord-group",
        title: "E 调布鲁斯基础和弦",
        chords: [
          {
            name: "E7",
            subtitle: "I7",
            // 0 2 0 1 3 0 (BYCU 书中特定的指法：小指按2弦3品，食指按3弦1品)
            frets: [0, 2, 0, 1, 3, 0],
            fingers: [0, 2, 0, 1, 4, 0] 
          },
          {
            name: "A7",
            subtitle: "IV7",
            // x 0 2 0 2 0 (常见的 A7 指法)
            frets: [-1, 0, 2, 0, 2, 0],
            fingers: [0, 0, 1, 0, 2, 0]
          },
          {
            name: "B7",
            subtitle: "V7",
            // x 2 1 2 0 2 (标准 B7)
            frets: [-1, 2, 1, 2, 0, 2],
            fingers: [0, 2, 1, 3, 0, 4]
          }
        ]
      },
      
      {
        type: "text",
        text: "为了能够快速、轻松地形成（演奏）它们，你就要一个一个地熟悉它们，然后从一个转换到另一个。我们将在本课的练习曲中使用这些和弦。"
      }
    ],

    // --- 7. 练习曲 (GP文件) ---
    etude: {
      title: "得克萨斯摇滚 (Texas Rock)",
      tempo: 120,
      audioSrc: asset("audio/texas_rock.mp3"), // 确保文件存在于 public/audio/
      gpFile: asset("tabs/texas_rock.gpx")      // 确保文件存在于 public/tabs/
    }
  },

  // --- 第 2 课 (保持原样或按需修改) ---
  {
    id: 2,
    title: "第 2 课：可移动音阶",
    subtitle: "Movable Scales",
    description: "学习如何移动指型 1 来在任意调演奏。",
    tags: ["可移动指型", "A调"],
    content: [
      {
        type: "text",
        text: "既然你已经学习了 E 小调五声音阶的指型 1，现在我们学习它的“可移动”类型。"
      },
      // ... 这里可以继续添加内容
    ],
    etude: {
      title: "Blues Rock Tune",
      tempo: 120,
      audioSrc: asset("audio/blues_rock.mp3"),
      gpFile: asset("tabs/blues_rock.gp5")
    }
  }
];

export const lessonService = {
  getAllLessons: async (): Promise<Lesson[]> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_LESSONS;
  },

  getLessonById: async (id: number): Promise<Lesson | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_LESSONS.find(l => l.id === id);
  }
};