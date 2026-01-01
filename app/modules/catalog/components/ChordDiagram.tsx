import { useTheme } from '@mui/material';
import type { Chord, ChordBarre } from '@/types';

export type { Chord, ChordBarre };

interface ChordDiagramProps {
  chord: Chord;
  width?: number;
  height?: number;
}

export default function ChordDiagram({ chord, width = 160, height = 220 }: ChordDiagramProps) {
  const theme = useTheme();
  
  // 📏 1. 调整布局参数
  // 增加 top padding 以防止标题和 x/o 标记重叠
  const padding = { top: 80, bottom: 30, left: 25, right: 25 };
  
  const gridWidth = width - padding.left - padding.right;
  const gridHeight = height - padding.top - padding.bottom;
  
  const numStrings = 6;
  const numFrets = 5; 
  
  const stringSpacing = gridWidth / (numStrings - 1);
  const fretSpacing = gridHeight / numFrets;

  const strokeColor = theme.palette.text.primary;
  const dotColor = theme.palette.text.primary;
  const muteColor = theme.palette.text.secondary;
  // 高亮色，用于标题
  const accentColor = theme.palette.primary.main; 

  // 辅助函数：根据弦的索引获取X坐标
  // strings: [6, 5, 4, 3, 2, 1] 对应 index [0, 1, 2, 3, 4, 5]
  const getStringX = (stringNum: number) => {
    // 输入 6 返回 index 0 的 x
    // 输入 1 返回 index 5 的 x
    const index = 6 - stringNum; 
    return index * stringSpacing;
  };

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ userSelect: 'none' }}>
      
      {/* --- 1. 标题区域 (调整了Y坐标，防止重叠) --- */}
      {/* 顶部：副标题 (如 I7) */}
      {chord.subtitle && (
        <text 
          x={width / 2} 
          y={30} 
          textAnchor="middle" 
          fill={theme.palette.text.secondary}
          fontSize="14"
          fontFamily="serif" // 使用衬线体更有乐谱感
        >
          {chord.subtitle}
        </text>
      )}

      {/* 下方：和弦名 (如 E7) */}
      <text 
        x={width / 2} 
        y={55} 
        textAnchor="middle" 
        fill={accentColor} // 使用主题色
        fontWeight="bold" 
        fontSize="24"
      >
        {chord.name}
      </text>
      
      {/* --- 2. 绘制网格 --- */}
      <g transform={`translate(${padding.left}, ${padding.top})`}>
        
        {/* 琴枕 (Nut) */}
        <line x1={0} y1={0} x2={gridWidth} y2={0} stroke={strokeColor} strokeWidth={3} />

        {/* 品丝 (Frets) */}
        {Array.from({ length: numFrets + 1 }).map((_, i) => (
          <line 
            key={`fret-${i}`}
            x1={0} y1={i * fretSpacing} 
            x2={gridWidth} y2={i * fretSpacing} 
            stroke={strokeColor} 
            strokeWidth={i === 0 ? 0 : 1} 
            opacity={0.5}
          />
        ))}

        {/* 琴弦 (Strings) */}
        {Array.from({ length: numStrings }).map((_, i) => (
          <line 
            key={`string-${i}`}
            x1={i * stringSpacing} y1={0} 
            x2={i * stringSpacing} y2={gridHeight} 
            stroke={strokeColor} strokeWidth={1}
          />
        ))}

        {/* --- 3. 绘制横按 (Barres) ✅ 新增 --- */}
        {chord.barres?.map((barre, i) => {
          const startX = getStringX(barre.fromString);
          const endX = getStringX(barre.toString);
          const y = (barre.fret - 0.7) * fretSpacing; // 位置在品格中间偏上一点
          
          // 绘制贝塞尔曲线 (弧线)
          // M startX y : 移动到起点
          // Q controlX controlY, endX endY : 二次贝塞尔曲线
          // 控制点在两点中间，稍微向上拱起 (-12)
          const controlX = (startX + endX) / 2;
          const controlY = y - 12; 

          return (
            <path
              key={`barre-${i}`}
              d={`M ${startX} ${y} Q ${controlX} ${controlY}, ${endX} ${y}`}
              fill="none"
              stroke={dotColor}
              strokeWidth={2}
              strokeLinecap="round"
            />
          );
        })}

        {/* --- 4. 绘制点、X、O --- */}
        {chord.frets.map((fret, stringIndex) => {
          const x = stringIndex * stringSpacing;
          
          // X (闷音) - 位置上移，避免贴着琴枕
          if (fret === -1) {
            return <text key={stringIndex} x={x} y={-12} textAnchor="middle" fill={muteColor} fontSize="14">x</text>;
          }

          // O (空弦) - 位置上移
          if (fret === 0) {
            return <circle key={stringIndex} cx={x} cy={-16} r={3.5} fill="none" stroke={strokeColor} strokeWidth={1.5} />;
          }

          // 实心点
          const y = (fret - 0.5) * fretSpacing;
          return <circle key={stringIndex} cx={x} cy={y} r={6.5} fill={dotColor} />;
        })}
      </g>

      {/* --- 5. 底部指法数字 --- */}
      {chord.fingers && (
        <g transform={`translate(${padding.left}, ${padding.top + gridHeight + 20})`}>
          {chord.fingers.map((finger, i) => (
            finger > 0 ? (
              <text 
                key={i} 
                x={i * stringSpacing} y={5} 
                textAnchor="middle" 
                fill={theme.palette.text.primary} 
                fontSize="14" fontWeight="bold"
              >
                {finger}
              </text>
            ) : null
          ))}
        </g>
      )}
    </svg>
  );
}