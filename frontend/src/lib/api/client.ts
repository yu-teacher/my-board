import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type {
  Post,
  Page,
  ApiError,
  PostCreateDto,
  PostUpdateDto,
  CommentCreateDto,
  CommentUpdateDto,
  AdminLoginDto,
  AdminLoginResponseDto
} from '$lib/types';

const BASE_URL = dev 
  ? 'http://localhost:8080/api'  // 로컬 개발 환경
  : '/api';   // 도커 환경

export class ApiClient {
  private static async fetchWithError(url: string, customFetch: typeof fetch = fetch, options?: RequestInit) {
    const response = await customFetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '알 수 없는 오류가 발생했습니다.');
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  private static getAuthHeaders(): Record<string, string> {
    const token = localStorage?.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  static async getPosts(page = 0, size = 10, sort = 'createdAt', direction = 'DESC', customFetch: typeof fetch = fetch): Promise<Page<Post>> {
    return this.fetchWithError(
      `${BASE_URL}/posts?page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
      customFetch
    );
  }

  static async searchPosts(keyword: string, searchType = 'title', page = 0, size = 10, customFetch: typeof fetch = fetch): Promise<Page<Post>> {
    return this.fetchWithError(
      `${BASE_URL}/posts/search?keyword=${keyword}&searchType=${searchType}&page=${page}&size=${size}`,
      customFetch
    );
  }

  static async getPost(id: number, customFetch: typeof fetch = fetch): Promise<Post> {
    const response = await customFetch(`${BASE_URL}/posts/${id}`);
    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData
        });
        throw new Error(errorData.message || '게시글을 찾을 수 없습니다.');
    }
    return response.json();
}

  static async createPost(data: PostCreateDto, customFetch: typeof fetch = fetch): Promise<Post> {
    return this.fetchWithError(`${BASE_URL}/posts`, customFetch, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updatePost(id: number, data: PostUpdateDto, customFetch: typeof fetch = fetch): Promise<Post> {
    return this.fetchWithError(`${BASE_URL}/posts/${id}`, customFetch, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deletePost(id: number, password: string, customFetch: typeof fetch = fetch): Promise<void> {
    return this.fetchWithError(`${BASE_URL}/posts/${id}`, customFetch, {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
  }

  static async adminDeletePost(id: number, customFetch: typeof fetch = fetch): Promise<void> {
    return this.fetchWithError(`${BASE_URL}/admin/posts/${id}`, customFetch, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  static async createComment(postId: number, data: CommentCreateDto, customFetch: typeof fetch = fetch) {
    return this.fetchWithError(`${BASE_URL}/posts/${postId}/comments`, customFetch, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async createReply(postId: number, parentId: number, data: CommentCreateDto, customFetch: typeof fetch = fetch) {
    return this.fetchWithError(`${BASE_URL}/posts/${postId}/comments/${parentId}/replies`, customFetch, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateComment(postId: number, commentId: number, data: CommentUpdateDto, customFetch: typeof fetch = fetch) {
    return this.fetchWithError(`${BASE_URL}/posts/${postId}/comments/${commentId}`, customFetch, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async getComments(postId: number, customFetch: typeof fetch = fetch) {
    return this.fetchWithError(`${BASE_URL}/posts/${postId}/comments`, customFetch);
  }

  static async getReplies(postId: number, commentId: number, customFetch: typeof fetch = fetch) {
    return this.fetchWithError(`${BASE_URL}/posts/${postId}/comments/${commentId}/replies`, customFetch);
  }

  static async deleteComment(postId: number, commentId: number, password: string, customFetch: typeof fetch = fetch): Promise<void> {
    await this.fetchWithError(`${BASE_URL}/posts/${postId}/comments/${commentId}`, customFetch, {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
  }

  static async adminDeleteComment(commentId: number, customFetch: typeof fetch = fetch): Promise<void> {
    await this.fetchWithError(`${BASE_URL}/admin/comments/${commentId}`, customFetch, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  static async adminLogin(data: AdminLoginDto, customFetch: typeof fetch = fetch): Promise<AdminLoginResponseDto> {
    return this.fetchWithError(`${BASE_URL}/admin/login`, customFetch, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}