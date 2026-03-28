import type { BaseDto, FileDto } from "./common/base.dto";

export interface BlogDto extends BaseDto {
  authorId: string;
  author?: {
    id: string;
    username?: string;
    fullName?: string;
  };
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: FileDto;
  category?: string;
  tags?: string[];
  viewCount?: number;
  likeCount?: number;
  status: string;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: Date;
}

export interface CreateBlogDto {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: FileDto | FileDto[];
  category?: string;
  tags?: string[];
  status: string;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: Date;
}

export interface UpdateBlogDto extends CreateBlogDto {
  id: string;
}

export interface BlogFilterDto {
  title?: string;
  category?: string;
  status?: string;
  isDeleted?: boolean;
}

export interface BlogSelectBoxDto {
  id: string;
  title: string;
  slug: string;
}

export interface BlogCommentDto extends BaseDto {
  postId: string;
  post?: {
    id: string;
    title: string;
  };
  customerId: string;
  customer?: {
    id: string;
    username?: string;
    fullName?: string;
  };
  parentId?: string;
  parent?: BlogCommentDto;
  replies?: BlogCommentDto[];
  content: string;
  status: string;
}

export interface CreateBlogCommentDto {
  postId: string;
  content: string;
  parentId?: string;
}

export interface UpdateBlogCommentDto {
  id: string;
  content: string;
}

export interface BlogCommentFilterDto {
  postId?: string;
  customerId?: string;
  status?: string;
  parentId?: string;
  isDeleted?: boolean;
}
