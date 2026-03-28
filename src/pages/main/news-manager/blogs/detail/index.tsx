import { ROUTES } from "@/common/constants";
import { enumData } from "@/common/enums/enum";
import ActionConfirm, {
  type ActionConfirmRef,
} from "@/components/ui/ActionConfirm";
import BaseView from "@/components/ui/BaseView";
import { CommonActions } from "@/components/ui/CommonAction";
import GlobalLoading from "@/components/ui/Loading";
import RowActions from "@/components/ui/RowAction";
import StatusTag from "@/components/ui/StatusTag";
import {
  useActivateBlog,
  useArchiveBlog,
  useBlogDetail,
  useDeactivateBlog,
  useDraftBlog,
  usePublishBlog,
  useRejectBlog,
  useUnarchiveBlog,
} from "@/hooks/blog";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { useRef } from "react";
import { useParams } from "react-router-dom";

export default function DetailBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: blog, isLoading, refetch } = useBlogDetail(id);

  const publishConfirmRef = useRef<ActionConfirmRef>(null);
  const draftConfirmRef = useRef<ActionConfirmRef>(null);
  const rejectConfirmRef = useRef<ActionConfirmRef>(null);
  const archiveConfirmRef = useRef<ActionConfirmRef>(null);
  const unarchiveConfirmRef = useRef<ActionConfirmRef>(null);
  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const { onPublishBlog, isLoading: isPublishing } = usePublishBlog();
  const { onDraftBlog, isLoading: isDrafting } = useDraftBlog();
  const { onRejectBlog, isLoading: isRejecting } = useRejectBlog();
  const { onArchiveBlog, isLoading: isArchiving } = useArchiveBlog();
  const { onUnarchiveBlog, isLoading: isUnarchiving } = useUnarchiveBlog();
  const { onActivateBlog, isLoading: isActivating } = useActivateBlog();
  const { onDeactivateBlog, isLoading: isDeactivating } = useDeactivateBlog();

  const handlePublish = async () => {
    if (!blog?.id) return;
    if (
      isPublishing ||
      isArchiving ||
      isUnarchiving ||
      isActivating ||
      isDeactivating
    )
      return;
    await onPublishBlog(blog.id);
    await refetch();
  };

  const handleDraft = async () => {
    if (!blog?.id) return;
    if (isDrafting) return;
    await onDraftBlog(blog.id);
    await refetch();
  };

  const handleReject = async (reason?: string) => {
    if (!blog?.id) return;
    if (isRejecting) return;
    await onRejectBlog({ id: blog.id, reason });
    await refetch();
  };

  const handleArchive = async () => {
    if (!blog?.id) return;

    await onArchiveBlog(blog.id);
    await refetch();
  };

  const handleUnarchive = async () => {
    if (!blog?.id) return;
    await onUnarchiveBlog(blog.id);
    await refetch();
  };

  const handleActivate = async () => {
    if (!blog?.id) return;
    await onActivateBlog(blog.id);
    await refetch();
  };

  const handleDeactivate = async () => {
    if (!blog?.id) return;
    await onDeactivateBlog(blog.id);
    await refetch();
  };

  const handleEdit = () => {
    router.push(
      ROUTES.MAIN.NEW_MANAGER.children.BLOG_MANAGER.children.EDIT_BLOG.path.replace(
        ":id",
        blog?.id || "",
      ),
    );
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return <GlobalLoading />;
  }

  if (!blog) {
    return (
      <BaseView>
        <Card>
          <p>Không tìm thấy bài viết</p>
        </Card>
      </BaseView>
    );
  }

  const DetailRow = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="grid mb-3">
      <div className="col-12 md:col-3">
        <strong className="text-gray-700">{label}:</strong>
      </div>
      <div className="col-12 md:col-9">{value || "-"}</div>
    </div>
  );

  const getStatusSeverity = (status: string) => {
    switch (status) {
      case enumData.BLOG_STATUS.PUBLISHED.code:
        return "success";
      case enumData.BLOG_STATUS.DRAFT.code:
        return "info";
      case enumData.BLOG_STATUS.NEW.code:
        return "warning";
      case enumData.BLOG_STATUS.REJECT.code:
        return "danger";
      case enumData.BLOG_STATUS.ARCHIVED.code:
        return "secondary";
      default:
        return "info";
    }
  };

  const canPublish =
    !blog.isDeleted && blog.status !== enumData.BLOG_STATUS.PUBLISHED.code;
  const canDraft =
    !blog.isDeleted && blog.status !== enumData.BLOG_STATUS.DRAFT.code;
  const canReject =
    !blog.isDeleted && blog.status !== enumData.BLOG_STATUS.REJECT.code;
  const canArchive =
    !blog.isDeleted && blog.status !== enumData.BLOG_STATUS.ARCHIVED.code;
  const canUnarchive = blog.status === enumData.BLOG_STATUS.ARCHIVED.code;

  return (
    <BaseView>
      <Card
        title={
          <div className="flex align-items-center justify-content-between">
            <span>Chi tiết bài viết</span>
            <div className="flex gap-2">
              <StatusTag
                severity={getStatusSeverity(blog.status)}
                value={
                  enumData.BLOG_STATUS[
                    blog.status as keyof typeof enumData.BLOG_STATUS
                  ]?.name || blog.status
                }
              />
              <StatusTag
                severity={blog.isDeleted ? "danger" : "success"}
                value={
                  blog.isDeleted
                    ? enumData.STATUS_FILTER.INACTIVE.name
                    : enumData.STATUS_FILTER.ACTIVE.name
                }
              />
            </div>
          </div>
        }
      >
        <div className="mb-4">
          <RowActions
            actions={[
              {
                ...CommonActions.cancel(handleBack),
                label: "Quay lại",
              },
              {
                ...CommonActions.update(handleEdit),
                label: "Chỉnh sửa",
                visible: !blog.isDeleted,
              },
              {
                // eslint-disable-next-line react-hooks/refs
                ...CommonActions.approve(() =>
                  publishConfirmRef.current?.show(),
                ),
                label: "Xuất bản",
                visible: canPublish,
              },
              {
                key: "draft",
                label: "Chuyển sang nháp",
                icon: PrimeIcons.PENCIL,
                severity: "info",
                visible: canDraft,
                onClick: () => draftConfirmRef.current?.show(),
              },
              {
                // eslint-disable-next-line react-hooks/refs
                ...CommonActions.reject(() => rejectConfirmRef.current?.show()),
                label: "Từ chối",
                visible: canReject,
              },
              {
                key: "archive",
                label: "Lưu trữ",
                icon: PrimeIcons.INBOX,
                severity: "warning",
                visible: canArchive,
                onClick: () => archiveConfirmRef.current?.show(),
              },
              {
                key: "unarchive",
                label: "Khôi phục",
                icon: PrimeIcons.REPLAY,
                severity: "info",
                visible: canUnarchive,
                onClick: () => unarchiveConfirmRef.current?.show(),
              },
              {
                key: "activate",
                label: "Kích hoạt",
                icon: PrimeIcons.CHECK_CIRCLE,
                severity: "success",
                visible: blog.isDeleted,
                onClick: () => activateConfirmRef.current?.show(),
              },
              {
                key: "deactivate",
                label: "Ngừng hoạt động",
                icon: PrimeIcons.BAN,
                severity: "warning",
                visible: !blog.isDeleted,
                onClick: () => deactivateConfirmRef.current?.show(),
              },
            ]}
            justify="start"
            gap="medium"
          />
        </div>

        <Divider />

        {/* Thông tin cơ bản */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-3">Thông tin cơ bản</h3>
          <DetailRow label="Tiêu đề" value={blog.title} />
          <DetailRow label="Slug" value={blog.slug} />
          <DetailRow label="Mô tả ngắn" value={blog.excerpt || "-"} />
          <DetailRow label="Danh mục" value={blog.category || "-"} />
          <DetailRow
            label="Tags"
            value={
              blog.tags && blog.tags.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {blog.tags.map((tag, index) => (
                    <Tag key={index} value={tag} severity="info" />
                  ))}
                </div>
              ) : (
                "-"
              )
            }
          />
        </div>

        <Divider />

        {/* Ảnh đại diện */}
        {blog.featuredImage && (
          <>
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-3">Ảnh đại diện</h3>
              <img
                src={blog.featuredImage.fileUrl}
                alt={blog.title}
                className="w-full max-w-30rem border-round shadow-2"
              />
            </div>
            <Divider />
          </>
        )}

        {/* Nội dung */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-3">Nội dung bài viết</h3>
          <div
            className="blog-content p-3 border border-gray-300 border-round"
            dangerouslySetInnerHTML={{ __html: blog.content || "" }}
          />
        </div>

        <Divider />

        {/* SEO */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-3">Thông tin SEO</h3>
          <DetailRow label="SEO Title" value={blog.seoTitle || "-"} />
          <DetailRow
            label="SEO Description"
            value={blog.seoDescription || "-"}
          />
        </div>

        <Divider />

        {/* Thống kê */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-3">Thống kê</h3>
          <DetailRow label="Lượt xem" value={blog.viewCount || 0} />
          <DetailRow label="Lượt thích" value={blog.likeCount || 0} />
          <DetailRow
            label="Ngày xuất bản"
            value={
              blog.publishedAt
                ? new Date(blog.publishedAt).toLocaleString("vi-VN")
                : "-"
            }
          />
        </div>

        <Divider />

        {/* Thông tin hệ thống */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-3">Thông tin hệ thống</h3>
          <DetailRow
            label="Tác giả"
            value={blog.author?.fullName || blog.author?.username || "-"}
          />
          <DetailRow
            label="Ngày tạo"
            value={
              blog.createdAt
                ? new Date(blog.createdAt).toLocaleString("vi-VN")
                : "-"
            }
          />
          <DetailRow
            label="Ngày cập nhật"
            value={
              blog.updatedAt
                ? new Date(blog.updatedAt).toLocaleString("vi-VN")
                : "-"
            }
          />
        </div>
      </Card>

      {/* Action Confirms */}
      <ActionConfirm
        ref={publishConfirmRef}
        title="Xác nhận xuất bản bài viết"
        message="Bạn có chắc chắn muốn xuất bản bài viết này không?"
        confirmText="Xuất bản"
        cancelText="Hủy"
        onConfirm={handlePublish}
      />

      <ActionConfirm
        ref={draftConfirmRef}
        title="Xác nhận chuyển sang bản nháp"
        message="Bạn có chắc chắn muốn chuyển bài viết này sang bản nháp không?"
        confirmText="Chuyển sang nháp"
        cancelText="Hủy"
        onConfirm={handleDraft}
      />

      <ActionConfirm
        ref={rejectConfirmRef}
        title="Xác nhận từ chối bài viết"
        message="Bạn có chắc chắn muốn từ chối bài viết này không?"
        confirmText="Từ chối"
        cancelText="Hủy"
        withReason={true}
        isRequireReason={true}
        onConfirm={handleReject}
      />

      <ActionConfirm
        ref={archiveConfirmRef}
        title="Xác nhận lưu trữ bài viết"
        message="Bạn có chắc chắn muốn lưu trữ bài viết này không?"
        confirmText="Lưu trữ"
        cancelText="Hủy"
        onConfirm={handleArchive}
      />

      <ActionConfirm
        ref={unarchiveConfirmRef}
        title="Xác nhận khôi phục từ lưu trữ"
        message="Bạn có chắc chắn muốn khôi phục bài viết này từ lưu trữ không?"
        confirmText="Khôi phục"
        cancelText="Hủy"
        onConfirm={handleUnarchive}
      />

      <ActionConfirm
        ref={activateConfirmRef}
        title="Xác nhận kích hoạt bài viết"
        message="Bạn có chắc chắn muốn kích hoạt bài viết này không?"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động bài viết"
        message="Bạn có chắc chắn muốn ngừng hoạt động bài viết này không?"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        withReason={true}
        isRequireReason={true}
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
