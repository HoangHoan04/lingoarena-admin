import dayjs from "dayjs";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";
import { useState, type ReactNode } from "react";

export interface FilterField {
  key: string;
  label: string;
  type:
    | "input"
    | "textarea"
    | "select"
    | "multiSelect"
    | "number"
    | "switch"
    | "date"
    | "dateRange"
    | "customButton"
    | "custom";
  placeholder?: string;
  options?: { label: string; value: any }[];
  onClick?: () => void;
  buttonText?: string;
  disabled?: boolean;
  col?: number;
  render?: (value: any, onChange: (next: any) => void) => ReactNode;
}

export interface FilterComponentProps {
  title?: string | ReactNode;
  fields: FilterField[];
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  onSearch?: () => void;
  onClear?: () => void;
  showSearchButton?: boolean;
  showClearButton?: boolean;
  isOpen?: boolean;
}

function FilterComponent({
  title,
  fields,
  filters,
  onFiltersChange,
  onSearch,
  onClear,
  showSearchButton = true,
  showClearButton = true,
  isOpen = true,
}: FilterComponentProps) {
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const [activeIndex, setActiveIndex] = useState<number | null>(
    isOpen ? 0 : null,
  );

  const handleSearch = () => onSearch && onSearch();

  const handleClear = () => {
    onFiltersChange({});
    if (onClear) onClear();
  };

  const renderField = (field: FilterField) => {
    const value = filters[field.key];
    switch (field.type) {
      case "input":
        return (
          <InputText
            value={value}
            disabled={field.disabled}
            placeholder={field.placeholder}
            className="w-full"
            onChange={(e) => handleFilterChange(field.key, e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        );
      case "textarea":
        return (
          <InputTextarea
            value={value}
            disabled={field.disabled}
            placeholder={field.placeholder}
            rows={3}
            className="w-full"
            onChange={(e) => handleFilterChange(field.key, e.target.value)}
          />
        );
      case "number":
        return (
          <InputNumber
            value={value}
            disabled={field.disabled}
            className="w-full"
            onValueChange={(e) => handleFilterChange(field.key, e.value)}
          />
        );
      case "select":
        return (
          <Dropdown
            value={value}
            options={field.options?.map((opt) => ({
              label: opt.label,
              value: opt.value,
            }))}
            disabled={field.disabled}
            placeholder={field.placeholder}
            className="w-full"
            onChange={(e) => handleFilterChange(field.key, e.value)}
            showClear
          />
        );
      case "multiSelect":
        return (
          <MultiSelect
            value={value || []}
            options={field.options?.map((opt) => ({
              label: opt.label,
              value: opt.value,
            }))}
            disabled={field.disabled}
            placeholder={field.placeholder}
            className="w-full"
            onChange={(e) => handleFilterChange(field.key, e.value)}
          />
        );
      case "switch":
        return (
          <div className="flex justify-center w-full">
            <InputSwitch
              checked={!!value}
              disabled={field.disabled}
              onChange={(e) => handleFilterChange(field.key, e.value)}
            />
          </div>
        );
      case "date":
        return (
          <Calendar
            value={value ? dayjs(value).toDate() : null}
            disabled={field.disabled}
            placeholder={field.placeholder}
            className="w-full"
            onChange={(e) =>
              handleFilterChange(
                field.key,
                e.value ? dayjs(e.value).format("YYYY-MM-DD") : null,
              )
            }
          />
        );
      case "dateRange":
        return (
          <Calendar
            value={
              value && Array.isArray(value) && value.length === 2
                ? [dayjs(value[0]).toDate(), dayjs(value[1]).toDate()]
                : null
            }
            selectionMode="range"
            disabled={field.disabled}
            placeholder={field.placeholder}
            className="w-full"
            onChange={(e) =>
              handleFilterChange(
                field.key,
                e.value && e.value[0] && e.value[1]
                  ? [
                      dayjs(e.value[0]).format("YYYY-MM-DD"),
                      dayjs(e.value[1]).format("YYYY-MM-DD"),
                    ]
                  : null,
              )
            }
          />
        );
      case "customButton":
        return (
          <Button
            label={field.buttonText || field.label}
            onClick={field.onClick}
            disabled={field.disabled}
            className="w-full"
          />
        );
      case "custom":
        return field.render
          ? field.render(value, (v) => handleFilterChange(field.key, v))
          : null;
      default:
        return null;
    }
  };

  return (
    <Accordion
      activeIndex={activeIndex}
      onTabChange={(e) => setActiveIndex(e.index as number | null)}
      style={{ marginBottom: 5 }}
    >
      <AccordionTab
        header={title || "Tìm kiếm"}
        style={{
          fontSize: 12,
        }}
      >
        <div className="grid grid-cols-24 gap-4 m-2">
          {fields.map((field) => {
            const colClass = {
              3: "lg:col-span-3",
              4: "lg:col-span-4",
              6: "lg:col-span-6",
              8: "lg:col-span-8",
              12: "lg:col-span-12",
              24: "lg:col-span-24",
            }[field.col ?? 6];

            return (
              <div
                key={field.key}
                className={`col-span-24 ${colClass} flex flex-col  justify-between`}
              >
                <label className="mb-2 text-xs font-medium">
                  {field.label}
                </label>

                <div className="flex-1 flex items-center">
                  {renderField(field)}
                </div>
              </div>
            );
          })}
        </div>

        {(showSearchButton || showClearButton) && (
          <div className="flex justify-center mt-4 gap-2">
            {showSearchButton && (
              <Button
                label="Tìm kiếm"
                icon="pi pi-search"
                style={{
                  height: 30,
                  fontSize: 13,
                }}
                onClick={handleSearch}
                className="p-button-info rounded-2xl"
              />
            )}
            {showClearButton && (
              <Button
                label="Xóa bộ lọc"
                icon="pi pi-undo"
                onClick={handleClear}
                style={{
                  height: 30,
                  fontSize: 13,
                }}
                className="p-button-secondary rounded-2xl"
              />
            )}
          </div>
        )}
      </AccordionTab>
    </Accordion>
  );
}

export default FilterComponent;
