import { enumData } from "@/common/enums/enum";
import { useToast } from "@/context/ToastContext";
import type { FileDto } from "@/dto";
import { useUploadSingle } from "@/hooks/uploadFile";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import {
  type FileUploadHandlerEvent,
  FileUpload as PrimeFileUpload,
} from "primereact/fileupload";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";

interface UploadFileItem {
  uid: string;
  name: string;
  url: string;
  file?: File;
}

interface FileUploadProps {
  label?: string;
  required?: boolean;
  type?: "document" | "image" | "all";
  maxSize?: number;
  onFileUploaded?: (url: FileDto[] | FileDto | null) => void;
  initValue?: FileDto[] | FileDto | string | null;
  mode?: "single" | "multi";
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}

const mapInitValueToFileList = (
  initValue?: FileUploadProps["initValue"],
  mode: "single" | "multi" = "single",
): UploadFileItem[] => {
  if (!initValue || initValue === "") return [];
  const values = Array.isArray(initValue) ? initValue : [initValue];
  const targetValues =
    mode === "multi"
      ? values
      : values.length > 0
        ? [values[values.length - 1]]
        : [];

  return targetValues
    .filter(
      (item): item is FileDto =>
        !!item && typeof item === "object" && !!item.fileUrl,
    )
    .map((item) => ({
      uid: item.id || `file-${Date.now()}-${Math.random()}`,
      name: item.fileName || "file",
      url: item.fileUrl,
    }));
};

const mapFileListToDto = (fileList: UploadFileItem[]): FileDto[] =>
  fileList.map((file) => ({
    id: file.uid,
    fileUrl: file.url,
    fileName: file.name,
  }));

const getAcceptType = (type: FileUploadProps["type"]): string => {
  switch (type) {
    case "document":
      return ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt";
    case "image":
      return "image/*";
    default:
      return "*";
  }
};

export default function FileUploadCustom({
  label,
  required = false,
  type = "image",
  maxSize = enumData.maxSizeUpload,
  onFileUploaded,
  style,
  className,
  initValue,
  mode = "single",
  disabled = false,
}: FileUploadProps) {
  const { onUpload } = useUploadSingle();
  const { showToast } = useToast();
  const fileUploadRef = useRef<PrimeFileUpload>(null);

  const [fileList, setFileList] = useState<UploadFileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<UploadFileItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const nextFiles = mapInitValueToFileList(initValue, mode);
    setFileList((prev) => {
      const currentUrls = prev.map((f) => f.url).join("|");
      const nextUrls = nextFiles.map((f) => f.url).join("|");

      if (currentUrls !== nextUrls) {
        return nextFiles;
      }
      return prev;
    });
  }, [initValue, mode]);

  const triggerChange = (newFiles: UploadFileItem[]) => {
    if (onFileUploaded) {
      const dtos = mapFileListToDto(newFiles);
      onFileUploaded(mode === "multi" ? dtos : dtos[0] || null);
    }
  };

  const onCustomUpload = async (event: FileUploadHandlerEvent) => {
    const file = event.files[0];
    if (file.size / 1024 / 1024 >= maxSize) {
      showToast({
        type: "error",
        title: "Lỗi",
        message: `File quá lớn. Kích thước tối đa cho phép là ${maxSize} MB.`,
      });
      fileUploadRef.current?.clear();
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await onUpload(formData);

      if (response) {
        const newItem: UploadFileItem = {
          uid: response.id || `new-${Date.now()}`,
          name: file.name,
          url: response.fileUrl,
          file: file,
        };

        let newFileList: UploadFileItem[] = [];
        setFileList((prev) => {
          if (mode === "single") {
            newFileList = [newItem];
          } else {
            newFileList = [...prev, newItem];
          }
          return newFileList;
        });

        triggerChange(mode === "single" ? [newItem] : [...fileList, newItem]);

        showToast({
          type: "success",
          title: "Thành công",
          message: "Tải lên thành công",
          timeout: 2000,
        });
      }
    } catch (error) {
      showToast({
        type: "error",
        title: "Lỗi",
        message: "Tải lên thất bại",
      });
    } finally {
      setLoading(false);
      fileUploadRef.current?.clear();
    }
  };

  const handleRemove = (uid: string) => {
    const newFiles = fileList.filter((item) => item.uid !== uid);
    setFileList(newFiles);
    triggerChange(newFiles);
  };

  const isImageCheck = (urlOrName: string) => {
    return (
      /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(urlOrName) || type === "image"
    );
  };

  const showUploadBtn =
    !disabled && (mode === "multi" || fileList.length === 0);

  const boxSizeClass = "w-32 h-32 min-w-[128px] min-h-[128px]";

  return (
    <div className={classNames("flex flex-col gap-2", className)} style={style}>
      {label && (
        <label className="text-sm font-semibold ">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex flex-wrap gap-4">
        {fileList.map((item) => (
          <div
            key={item.uid}
            className={classNames(
              boxSizeClass,
              "group relative rounded-lg border  overflow-hidden shadow-sm",
            )}
          >
            <div className="w-full h-full flex items-center justify-center ">
              {isImageCheck(item.url || item.name) ? (
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-2 text-center ">
                  <i className="pi pi-file text-3xl mb-1"></i>
                  <span className="text-[10px] w-full break-all">
                    {item.name}
                  </span>
                </div>
              )}
            </div>

            {!disabled && (
              <div className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 z-20">
                <Button
                  icon="pi pi-eye"
                  rounded
                  text
                  className="  w-8! h-8! p-0!"
                  onClick={() => {
                    setPreviewImage(item);
                    setIsPreviewOpen(true);
                  }}
                  tooltip="Xem"
                  tooltipOptions={{ position: "top" }}
                />
                <Button
                  icon="pi pi-trash"
                  rounded
                  text
                  severity="danger"
                  className="  w-8! h-8! p-0! text-red-600!"
                  onClick={() => handleRemove(item.uid)}
                  tooltip="Xóa"
                  tooltipOptions={{ position: "top" }}
                />
              </div>
            )}
          </div>
        ))}

        {showUploadBtn && (
          <div className={classNames(boxSizeClass, "relative group")}>
            <PrimeFileUpload
              ref={fileUploadRef}
              mode="basic"
              name="file"
              accept={getAcceptType(type)}
              maxFileSize={maxSize * 1024 * 1024}
              customUpload
              uploadHandler={onCustomUpload}
              auto={true}
              disabled={loading}
              chooseOptions={{
                className: classNames(
                  "!absolute !inset-0 !w-full !h-full !opacity-0 !z-10 !p-0 !border-0",
                  "cursor-pointer",
                ),
                style: { width: "100%", height: "100%" },
              }}
              className="w-full! h-full!"
            />

            <div
              className={classNames(
                "absolute inset-0 z-0",
                "border-2 border-dashed rounded-lg",
                "flex flex-col items-center justify-center gap-1",
                "group-hover:border-blue-500  transition-colors duration-200",
                " group-hover:text-blue-500",
              )}
            >
              {loading ? (
                <i className="pi pi-spin pi-spinner text-2xl"></i>
              ) : (
                <>
                  <i className="pi pi-plus text-2xl"></i>
                  <span className="text-xs font-medium">
                    Thêm {type === "image" ? "hình ảnh" : "tài liệu"}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {!disabled && showUploadBtn && (
        <div className="text-xs ">
          {type === "image"
            ? "Chỉ chấp nhận tệp hình ảnh"
            : "Chỉ chấp nhận tệp tài liệu"}{" "}
          • Kích thước tối đa: {maxSize}MB
        </div>
      )}

      <Dialog
        header={previewImage?.name || "Chi tiết tệp"}
        visible={isPreviewOpen}
        onHide={() => setIsPreviewOpen(false)}
        maximizable
        modal
        className="w-[90vw] md:w-[70vw] lg:w-[50vw]"
        contentClassName="p-0  flex items-center justify-center min-h-[300px]"
        headerClassName="border-b"
      >
        {previewImage && (
          <div className="p-4 w-full h-full flex items-center justify-center">
            {isImageCheck(previewImage.url) ? (
              <img
                src={previewImage.url}
                alt={previewImage.name}
                className="max-w-full max-h-[70vh] object-contain shadow-lg rounded"
              />
            ) : (
              <div className="text-center p-10">
                <i className="pi pi-file text-6xl  mb-4"></i>
                <p className="font-bold text-xl mb-4">{previewImage.name}</p>
                <Button
                  label="Tải xuống"
                  icon="pi pi-download"
                  onClick={() => window.open(previewImage.url, "_blank")}
                />
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
}
