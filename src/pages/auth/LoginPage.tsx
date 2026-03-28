import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-[#0a0a0f] font-['DM_Sans'] overflow-hidden">
      <div className="hidden md:flex flex-1 relative items-center justify-center p-16 bg-linear-to-br from-[#0d0d1a] via-[#0f1628] to-[#0a1020] overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        ></div>

        <div className="absolute -top-20 -left-20 w-105 h-105 rounded-full bg-indigo-600/30 blur-[80px] animate-pulse"></div>
        <div className="absolute -bottom-15 -right-15 w-75 h-75 rounded-full bg-cyan-600/30 blur-[80px] animate-pulse delay-700"></div>
        <div className="relative z-10 w-full max-w-105 space-y-12">
          <div className="flex items-center gap-3">
            <i className="pi pi-sparkles text-[22px] text-[#818cf8]"></i>
            <span className="font-['Syne'] font-extrabold text-xl text-white tracking-[0.12em] uppercase">
              LingoArena
            </span>
          </div>

          <div className="space-y-4">
            <h2 className="font-['Syne'] text-4xl md:text-5xl font-bold text-white leading-tight">
              Hệ thống luyện thi
              <br />
              Aptis Online.
            </h2>
            <p className="text-[#94a3b8] text-base leading-relaxed">
              Hệ thống quản lý luyện thi chuyên nghiệp, hiện đại và tối ưu cho
              học viên.
            </p>
          </div>

          <div className="flex gap-4 opacity-40">
            <div className="w-12 h-1.5 bg-indigo-500 rounded-full"></div>
            <div className="w-12 h-1.5 bg-cyan-500 rounded-full"></div>
            <div className="w-12 h-1.5 bg-indigo-500/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Form Section */}
      <div className="w-full md:w-120 bg-white flex items-center justify-center p-10 md:p-12">
        <LoginForm />
      </div>
    </div>
  );
}
