import { Button } from "primereact/button";

interface Document {
  id: string;
  fileName: string;
  fileUrl: string;
}

const DocumentList = ({ documents }: { documents: Document[] }) => {
  if (!documents || documents.length === 0) {
    return (
      <div className="text-gray-500 italic p-4 border border-dashed rounded-lg text-center">
        Không có tài liệu nào
      </div>
    );
  }

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white transition-colors shadow-sm"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <i className="pi pi-file-pdf text-red-500 text-2xl"></i>
            <div className="flex flex-col overflow-hidden">
              <span
                className="text-sm font-medium text-gray-800 truncate"
                title={doc.fileName}
              >
                {doc.fileName}
              </span>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <Button
              icon="pi pi-eye"
              tooltip="Xem"
              tooltipOptions={{ position: "top" }}
              className="p-button-rounded p-button-text p-button-info"
              onClick={() => handleView(doc.fileUrl)}
            />
            <Button
              icon="pi pi-download"
              tooltip="Tải xuống"
              tooltipOptions={{ position: "top" }}
              className="p-button-rounded p-button-text p-button-success"
              onClick={() => handleDownload(doc.fileUrl, doc.fileName)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
