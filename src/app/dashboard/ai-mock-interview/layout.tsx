import AiMockFullscreenLayout from "./ai-mock-fullscreen-layout";

export default function AiMockInterviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AiMockFullscreenLayout>{children}</AiMockFullscreenLayout>;
}
