package com.beasts.board.comment.dto;


import com.beasts.board.comment.entity.Comment;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class CommentResponseDTO {
    private final Long id;
    private final String content;
    private final String nickname;
    private final LocalDateTime createdAt;
    private final int depth;
    private final List<CommentResponseDTO> replies;

    public CommentResponseDTO(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.nickname = comment.getNickname();
        this.createdAt = comment.getCreatedAt();
        this.depth = comment.getDepth();
        this.replies = comment.getReplies().stream()
                .map(CommentResponseDTO::new)
                .collect(Collectors.toList());
    }
}
