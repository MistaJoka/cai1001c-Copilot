import { RoutedTemplateBody } from "@/components/routed-template-body";

export default function Template({ children }: { children: React.ReactNode }) {
  return <RoutedTemplateBody>{children}</RoutedTemplateBody>;
}
