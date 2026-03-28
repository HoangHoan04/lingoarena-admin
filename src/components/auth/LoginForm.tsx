import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useState } from "react";

export default function LoginForm() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!form.username || !form.password) {
      showToast({
        type: "error",
        timeout: 3000,
        message: "Vui lòng điền đầy đủ thông tin đăng nhập.",
        title: "Lỗi đăng nhập",
      });
      return;
    }

    setIsLoading(true);
    try {
      await login({ username: form.username, password: form.password });
    } catch (err: any) {
      showToast({
        type: "error",
        timeout: 3000,
        message: "Đăng nhập thất bại. Vui lòng kiểm tra lại.",
        title: "Lỗi đăng nhập",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-96 mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Chào mừng trở lại
        </h1>
        <p className="text-slate-500 text-sm">
          Nhập thông tin quản trị để tiếp tục
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-8">
        {/* Username Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-['DM_Sans']! font-extrabold! text-indigo-500 uppercase tracking-widest">
            Tên người dùng
          </label>
          <InputText
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Nhập username"
            className={`w-full! border-t-0! border-l-0! border-r-0! border-b-[1.5px]! rounded-none! bg-transparent! px-0! py-2! shadow-none! focus:border-indigo-500! transition-colors ${
              submitted && !form.username
                ? "border-red-500!"
                : "border-slate-200!"
            }`}
          />
          {submitted && !form.username && (
            <small className="text-red-500 text-[12px] mt-1">
              Vui lòng nhập username.
            </small>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-['DM_Sans']! font-extrabold! text-indigo-500 uppercase tracking-[0.15em] ml-1">
            Mật khẩu
          </label>
          <Password
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            toggleMask
            feedback={false}
            placeholder="Vui lòng nhập mật khẩu"
            className="w-full"
            pt={{
              root: { className: "w-full flex relative" },
              input: {
                className: `w-96! !border-t-0 !border-l-0 !border-r-0 !border-b-[1.5px] !rounded-none !bg-transparent !px-0 !py-2 !shadow-none focus:!border-indigo-500 transition-colors ${
                  submitted && !form.password
                    ? "!border-red-500"
                    : "!border-slate-200"
                }`,
              },
              showIcon: {
                className:
                  "absolute right-0 top-1/2 -translate-y-1/6 text-gray-400 cursor-pointer !shadow-none !outline-none",
              },
              hideIcon: {
                className:
                  "absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer !shadow-none !outline-none",
              },
            }}
          />
          {submitted && !form.password && (
            <small className="text-red-500 text-[12px] mt-1 font-medium">
              Vui lòng nhập mật khẩu.
            </small>
          )}
        </div>

        {/* Options */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              inputId="remember"
              checked={form.remember}
              onChange={(e) =>
                setForm({ ...form, remember: e.checked ?? false })
              }
            />
            <label
              htmlFor="remember"
              className="text-sm text-slate-600 cursor-pointer select-none"
            >
              Nhớ mật khẩu
            </label>
          </div>
          <a
            href="#"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Quên mật khẩu?
          </a>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          label={isLoading ? "" : "Đăng nhập hệ thống"}
          loading={isLoading}
          className="w-full py-4! rounded-xl! border-none!  font-bold! text-base! bg-linear-to-r! from-indigo-500! to-indigo-700! shadow-[0_4px_20px_rgba(99,102,241,0.35)]! hover:scale-[1.01]! transition-all"
        />
      </form>
    </div>
  );
}
