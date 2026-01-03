import Sidebar from "@/components/ui/sidebar";

export default async function ChatLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex">
      {/* This sidebar is fixed on the left */}
      <Sidebar />
      <main className="h-full w-full">
        {children}
      </main>
    </div>
  );
}