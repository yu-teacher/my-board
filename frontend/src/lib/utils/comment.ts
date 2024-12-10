import type { Comment, CommentView } from '$lib/types';

export function transformToCommentView(comments: Comment[]): CommentView[] {
  return comments
    .filter(comment => !comment.parent)
    .map(comment => ({
      id: comment.id,
      content: comment.content,
      nickname: comment.nickname,
      createdAt: comment.createdAt,
      isReply: false,
      replies: comment.replies?.map(reply => ({
        id: reply.id,
        content: reply.content,
        nickname: reply.nickname,
        createdAt: reply.createdAt,
        isReply: true,
        replies: []
      })) || []
    }));
}