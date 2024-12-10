package com.beasts.board.post.dto;

import com.beasts.board.comment.entity.Comment;
import com.beasts.board.post.entity.Post;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class PostReadResponseDTO {
    private final Long id;
    private final String title;
    private final String content;
    private final String nickname;
    private final int viewCount;
    private final LocalDateTime createdAt;
    private final List<Comment> comments;

    public PostReadResponseDTO(Post post) {
        this.id = post.getId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.nickname = post.getNickname();
        this.viewCount = post.getViewCount();
        this.createdAt = post.getCreatedAt();
        this.comments = post.getComments().stream()
                .filter(comment -> comment.getDepth() == 0)
                .collect(Collectors.toList());
    }
}
