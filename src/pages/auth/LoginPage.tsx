import { login } from "@/assets/animations";
import LoginForm from "@/components/auth/LoginForm";
import ConfigSetting from "@/components/layout/ConfigSetting";
import { useTheme } from "@/context/ThemeContext";
import Lottie from "lottie-react";
import { Button } from "primereact/button";
import { useState } from "react";

export default function LoginPage() {
  const { theme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div
      className="login-page flex flex-col md:flex-row relative"
      data-theme={theme}
    >
      <Button
        icon="pi pi-cog"
        rounded
        text
        severity="secondary"
        onClick={() => setShowSettings(true)}
        tooltip="Cài đặt"
        tooltipOptions={{ position: "left" }}
        className="settings-btn"
      />

      <ConfigSetting
        visible={showSettings}
        onHide={() => setShowSettings(false)}
      />

      <div className="hero-section flex-1 flex flex-col justify-center items-center p-8">
        <div className="max-w-150 w-full text-center">
          <div className="logo-icon mb-4">
            <i className="pi pi-building"></i>
          </div>

          <div className="max-w-100 mx-auto">
            <Lottie animationData={login} loop />
          </div>

          <div className="mt-8">
            <h1 className="hero-title mb-4">
              Hệ thống đặt tour du lịch HIMLAMTOURIST
            </h1>
            <p className="hero-description max-w-125 mx-auto">
              Chào mừng bạn đến với hệ thống quản lý đặt tour du lịch của chúng
              tôi. Vui lòng đăng nhập để tiếp tục và trải nghiệm các tính năng
              quản lý tour du lịch một cách dễ dàng và hiệu quả.
            </p>
          </div>
        </div>
      </div>

      <div className="login-section flex-1 flex justify-center items-center p-8">
        <LoginForm />
      </div>
    </div>
  );
}
