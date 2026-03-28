import { Tag } from "primereact/tag";
import React from "react";

type SeverityType =
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "secondary"
  | null
  | undefined;

interface StatusTagProps {
  value: React.ReactNode;
  severity?: SeverityType;
  className?: string;
  style?: React.CSSProperties;
}

export default function StatusTag({
  value,
  severity = "info",
  className = "",
  style,
}: StatusTagProps) {
  const getColorClass = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600! border-green-600! bg-green-600/10!";

      case "danger":
        return "text-red-600! border-red-600! bg-red-600/10!";

      case "warning":
        return "text-orange-600! border-orange-600! bg-orange-600/10!";

      case "info":
        return "text-blue-600! border-blue-600! bg-blue-600/10!";

      case "secondary":
      default:
        return "text-gray-500! border-gray-500! bg-gray-500/10!";
    }
  };

  const colorClass = getColorClass(severity || "info");

  return (
    <Tag
      value={value}
      className={`border! bg-transparent! px-2.5 py-1 text-xs font-bold rounded ${colorClass} ${className}`}
      style={{
        borderWidth: "1px",
        boxShadow: "none",
        ...style,
      }}
    />
  );
}
