import PrivateRouteGuard from "@/components/auth/PrivateRouteGuard";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PrivateRouteGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </PrivateRouteGuard>
  );
}
