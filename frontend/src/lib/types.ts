export interface Post {
  id: number;
  title: string;
  content: string;
  nickname: string;
  viewCount: number;
  createdAt: string;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  nickname: string;
  createdAt: string;
  parent?: Comment;
  replies?: Comment[];
}

export interface CommentView {
  id: number;
  content: string;
  nickname: string;
  createdAt: string;
  isReply: boolean;
  replies: CommentView[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface PostCreateDto {
  title: string;
  content: string;
  nickname: string;
  password: string;
}

export interface PostUpdateDto {
  title: string;
  content: string;
  password: string;
}

export interface PasswordDto {
  password: string;
}

export interface CommentCreateDto {
  content: string;
  nickname: string;
  password: string;
}

export interface CommentUpdateDto {
  content: string;
  password: string;
}

export interface AdminLoginDto {
  username: string;
  password: string;
}

export interface AdminLoginResponseDto {
  accessToken: string;
}