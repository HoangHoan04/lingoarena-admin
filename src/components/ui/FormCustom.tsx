import type { Dayjs } from "dayjs";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { ProgressSpinner } from "primereact/progressspinner";
import type { ReactNode } from "react";
import { forwardRef, useImperativeHandle } from "react";
import useRenderFormCustom from "./RenderFiled";

export interface FormRef {
  getFieldsValue: () => Record<string, any>;
  setFieldsValue: (values: Record<string, any>) => void;
  resetFields: () => void;
  validateFields: () => Promise<boolean>;
}

export interface FormField {
  name: string;
  label: string;
  isSingle?: boolean;
  type:
    | "input"
    | "select"
    | "multiselect"
    | "textarea"
    | "richtext"
    | "tab"
    | "file"
    | "switch"
    | "datepicker"
    | "datetimepicker"
    | "daterangepicker"
    | "timePicker"
    | "number"
    | "image"
    | "checkbox"
    | "action"
    | "radioGroup"
    | "timeRangePicker"
    | "email"
    | "phoneNumber"
    | "custom";
  formatString?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  options?: { id: string; name: string; value?: any; node?: any }[];
  col?: 4 | 6 | 8 | 12 | 24;
  gridColumn?: string;
  tabFields?: FormField[][];
  fileType?: "image" | "document";
  optionLabel?: string;
  optionValue?: string;
  toggleFields?: FormField[];
  dateFormat?: string;
  rangePlaceholder?: [string, string];
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  render?: (fieldProps: {
    value: any;
    onChange: (val: any) => void;
  }) => React.ReactNode;
  onChange?: (value: any, form?: any) => void;
  onClear?: () => void;
  disabledDate?: (current: Dayjs) => boolean;
  disabledTime?: (current: Dayjs) => any;
  disabled?: boolean;
  defaultValue?: Dayjs;
  step?: number;
  min?: number;
  max?: number;
  addonAfter?: string;
  customComponent?: ReactNode;
  multiple?: boolean;
  maxCount?: number;
  rules?: any[];
  accept?: string;
  maxSize?: number;
  showSearch?: boolean;
  onSearch?: (value: any) => void;
  loading?: boolean;
  onAction?: (value: any, form?: any) => void;
  buttonLoading?: boolean;
  buttonText?: string;
  showUploadList?: boolean;
  listType?: "text" | "picture" | "picture-card" | "picture-circle";
  allowClear?: boolean;
  showTime?: boolean;
  optionFilterProp?: string;
  filterOption?: (input: string, option: any) => boolean;
}

export interface FormCustomProps {
  title?: string;
  fields: any[];
  loading?: boolean;
  initialValues?: Record<string, any>;
  onSubmit?: (values: any) => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  showDivider?: boolean;
  formStyle?: React.CSSProperties;
  gridColumns?: number;
  gap?: string;
  onChangeValue?: (allValues: any) => void;
  form?: FormRef;
}

const FormCustom = forwardRef<FormRef, FormCustomProps>(function FormCustom(
  {
    title,
    fields,
    loading = false,
    initialValues,
    onSubmit,
    onCancel,
    onChangeValue,
    submitText,
    cancelText,
    showDivider = true,
    formStyle,
    gridColumns = 24,
    gap = "16px",
  },
  ref,
) {
  const { renderField, getValues, setValues, resetFields, validateFields } =
    useRenderFormCustom(fields, initialValues, onChangeValue);

  useImperativeHandle(ref, () => ({
    getFieldsValue: getValues,
    setFieldsValue: setValues,
    resetFields,
    validateFields,
  }));

  const handleSubmit = async () => {
    const isValid = await validateFields();
    if (!isValid) return;
    const values = getValues();
    onSubmit?.(values);
  };

  const getGridColumnSpan = (col?: 4 | 6 | 8 | 12 | 24) => {
    if (!col) return "span 1";
    return `span ${col}`;
  };

  return (
    <>
      {title && (
        <>
          <div className="flex items-center justify-center ">
            <span className="text-xl font-semibold">{title}</span>
          </div>
          {showDivider && <Divider />}
        </>
      )}

      <div
        className="relative grid p-6 rounded-md"
        style={{
          gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
          gap,
          ...formStyle,
        }}
      >
        {fields.map((field) => (
          <div
            key={field.name}
            style={{
              gridColumn: field.gridColumn || getGridColumnSpan(field.col),
            }}
          >
            {renderField(field)}
          </div>
        ))}

        {(onCancel || onSubmit) && (
          <div
            className="text-center mt-4"
            style={{ gridColumn: `span ${gridColumns}` }}
          >
            <div className="flex justify-center gap-3">
              {onCancel && (
                <Button
                  label={cancelText || "Hủy"}
                  icon="pi pi-times-circle"
                  className="p-button-danger"
                  onClick={onCancel}
                  style={{
                    height: 30,
                    fontSize: 13,
                  }}
                />
              )}
              {onSubmit && (
                <Button
                  label={submitText || "Lưu"}
                  icon="pi pi-save"
                  className="p-button-success rounded-2xl"
                  style={{
                    height: 30,
                    fontSize: 13,
                  }}
                  onClick={handleSubmit}
                  loading={loading}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="absolute inset-0 w-full h-[calc(100vh-200px)] overflow-y-auto flex items-center justify-center z-50">
          <ProgressSpinner />
        </div>
      )}
    </>
  );
});

export default FormCustom;
