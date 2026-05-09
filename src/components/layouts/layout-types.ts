export type LayoutId =
  | "command-center"
  | "interactive-lesson"
  | "ai-tutor-workspace"
  | "quest-map"
  | "mobile-bottom-nav"
  | "adaptive-nav-rail"
  | "master-detail"
  | "card-grid-library"
  | "dashboard-action-cards"
  | "notebook-copilot";

export type LayoutStatus = "available" | "partial" | "planned";

export type LayoutRegistryEntry = {
  id: LayoutId;
  title: string;
  description: string;
  bestUse: string;
  route: string;
  status: LayoutStatus;
  primaryComponents: readonly string[];
  learningValue: string;
};
