import AuthHeader from "@/components/common/AuthHeader";
import AuthFooter from "@/components/common/AuthFooter";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <AuthHeader />
      <main className="desktop:min-h-screen md:px-[20px] lg:px-[30px] xl:px-[60px] py-[9px]">
        {children}
      </main>
      <AuthFooter />
    </div>
  );
}
