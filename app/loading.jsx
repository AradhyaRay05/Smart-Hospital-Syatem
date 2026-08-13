import { LoadingScreen } from "@/components/shared/loading-screen";

export default function Loading() {
  return (
    <div className="animate-in fade-in duration-300">
      <LoadingScreen />
    </div>
  );
}