import { loading } from "@/assets/animations";
import Lottie from "lottie-react";
import { ProgressSpinner } from "primereact/progressspinner";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
      <div className="w-52 h-52">
        <Lottie animationData={loading} loop />
      </div>

      <span className="mt-4 text-xl font-semibold ">Đang tải dữ liệu...</span>

      <div className="mt-4">
        <ProgressSpinner style={{ width: 50, height: 50 }} strokeWidth="4" />
      </div>
    </div>
  );
}
