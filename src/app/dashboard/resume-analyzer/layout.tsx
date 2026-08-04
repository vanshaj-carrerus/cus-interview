import DashboardFullscreenLayout from "../components/dashboard-fullscreen-layout";

export default function ResumeAnalyzerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardFullscreenLayout>{children}</DashboardFullscreenLayout>;
}
