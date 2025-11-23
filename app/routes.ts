import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("modules/catalog/pages/CatalogHome.tsx"),
  
  // 现有的课程详情
  route("lesson/:id", "modules/catalog/pages/LessonDetail.tsx"),
  
  // ... 其他路由
  
  // ✅ 新增测试路由
  route("test/chords", "modules/catalog/pages/ChordTestPage.tsx"),

  route("test/score", "modules/catalog/pages/ScoreTestPage.tsx"),

  route("tools/metronome", "modules/tools/pages/MetronomePage.tsx"),

] satisfies RouteConfig;