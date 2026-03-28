import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef, type CSSProperties } from "react";

export interface SubAction {
  key: string;
  label: string;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
  visible?: boolean;
  className?: string;
  style?: CSSProperties;
}

export interface ActionButton {
  key: string;
  label?: string;
  icon?: string;
  severity?:
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "help"
    | "contrast";
  outlined?: boolean;
  text?: boolean;
  rounded?: boolean;
  raised?: boolean;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  visible?: boolean;
  size?: "small" | "large";
  className?: string;
  style?: CSSProperties;
  tooltip?: string;
  tooltipPosition?: "top" | "left" | "right" | "bottom";
  badge?: string;
  subActions?: SubAction[];
  menuPosition?: "top" | "left" | "right" | "bottom";
  acceptFiles?: string;
  onFileSelect?: (file: File) => void;
}

export interface RowActionsProps {
  actions: ActionButton[];
  style?: CSSProperties;
  className?: string;
  size?: "small" | "large";
  direction?: "horizontal" | "vertical";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
  gap?: "none" | "small" | "medium" | "large";
  fullWidth?: boolean;
}

const getActionColor = (severity?: string) => {
  switch (severity) {
    case "secondary":
      return "#9e9e9e";
    case "success":
      return "#2e7d32";
    case "info":
      return "#0288d1";
    case "warning":
      return "#ed6c02";
    case "danger":
      return "#d32f2f";
    case "help":
      return "#9c27b0";
    default:
      return "#1976d2";
  }
};

const RowActions = ({
  actions,
  style = {},
  className = "",
  size = "small",
  direction = "horizontal",
  align = "center",
  justify = "start",
  wrap = false,
  gap = "small",
  fullWidth = false,
}: RowActionsProps) => {
  const overlayRefs = useRef<Record<string, OverlayPanel | null>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const getGapSize = () => {
    switch (gap) {
      case "none":
        return "0";
      case "small":
        return "0.5rem";
      case "medium":
        return "1rem";
      case "large":
        return "1.5rem";
      default:
        return "0.5rem";
    }
  };

  const getJustifyContent = () => {
    switch (justify) {
      case "start":
        return "flex-start";
      case "center":
        return "center";
      case "end":
        return "flex-end";
      case "between":
        return "space-between";
      case "around":
        return "space-around";
      case "evenly":
        return "space-evenly";
      default:
        return "flex-start";
    }
  };

  const getAlignItems = () => {
    switch (align) {
      case "start":
        return "flex-start";
      case "center":
        return "center";
      case "end":
        return "flex-end";
      case "stretch":
        return "stretch";
      default:
        return "center";
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onFileSelect?: (file: File) => void,
  ) => {
    const file = event.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
    event.target.value = "";
  };

  const handleSubActionClick = (subAction: SubAction, action: ActionButton) => {
    if (subAction.key === "upload-file" && action.onFileSelect) {
      const inputId = `file-input-${action.key}`;
      const fileInput = fileInputRefs.current[inputId];
      if (fileInput) {
        fileInput.click();
      }
    } else {
      subAction.onClick?.();
    }
    overlayRefs.current[action.key]?.hide();
  };

  const renderSubActionsMenu = (action: ActionButton) => {
    if (!action.subActions || action.subActions.length === 0) return null;
    const visibleSubActions = action.subActions.filter(
      (sub) => sub.visible !== false,
    );
    if (visibleSubActions.length === 0) return null;

    const menuItems = visibleSubActions.map((subAction) => ({
      label: subAction.label,
      icon: subAction.icon,
      disabled: subAction.disabled,
      className: subAction.className,
      style: subAction.style,
      command: () => handleSubActionClick(subAction, action),
    }));

    return (
      <>
        <OverlayPanel
          ref={(el) => {
            overlayRefs.current[action.key] = el;
          }}
          appendTo={document.body}
          pt={{
            content: { style: { padding: "0.2rem", borderRadius: "0" } },
          }}
        >
          <Menu
            model={menuItems}
            pt={{
              menu: { style: { padding: "0", borderRadius: "0" } },
              menuitem: { style: { padding: "0", borderRadius: "0" } },
            }}
          />
        </OverlayPanel>

        {action.onFileSelect && (
          <input
            ref={(el) => {
              fileInputRefs.current[`file-input-${action.key}`] = el;
            }}
            type="file"
            accept={action.acceptFiles || ".xlsx,.xls,.csv"}
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e, action.onFileSelect)}
          />
        )}
      </>
    );
  };

  const renderButton = (action: ActionButton, index: number) => {
    if (action.visible === false) return null;

    const hasSubActions = action.subActions && action.subActions.length > 0;
    const isLastButtons = index >= visibleActions.length - 2;
    const tooltipPosition = isLastButtons
      ? "left"
      : action.tooltipPosition || "top";

    const mainColor = getActionColor(action.severity);

    const button = (
      <Button
        label={action.label}
        icon={action.icon}
        outlined={action.outlined}
        text={action.text}
        rounded={action.rounded}
        raised={action.raised}
        loading={action.loading}
        disabled={action.disabled}
        size={action.size || size}
        className={`${
          action.className || ""
        } bg-transparent! hover:bg-black/5! shadow-none!`}
        style={{
          width: fullWidth ? "100%" : "auto",
          padding: "8px 16px",
          fontSize: "13px",

          border: `1px solid ${mainColor}`,
          color: mainColor,
          backgroundColor: "transparent",
          boxShadow: "none",

          ...action.style,
        }}
        badge={action.badge}
        onClick={
          hasSubActions
            ? (e) => overlayRefs.current[action.key]?.toggle(e)
            : action.onClick
        }
        data-pr-tooltip={action.tooltip || ""}
        data-pr-position={tooltipPosition}
      />
    );

    return (
      <div
        key={action.key}
        style={{
          display: "inline-block",
          width: fullWidth ? "100%" : undefined,
        }}
      >
        {button}
        {renderSubActionsMenu(action)}
      </div>
    );
  };

  const visibleActions = actions.filter((action) => action.visible !== false);

  if (visibleActions.length === 0) return null;

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: direction === "vertical" ? "column" : "row",
        alignItems: getAlignItems(),
        justifyContent: getJustifyContent(),
        flexWrap: wrap ? "wrap" : "nowrap",
        gap: getGapSize(),
        width: fullWidth ? "100%" : undefined,
        ...style,
      }}
    >
      {visibleActions.map((action, index) => renderButton(action, index))}
    </div>
  );
};

export default RowActions;
