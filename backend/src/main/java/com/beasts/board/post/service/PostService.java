package com.beasts.board.post.service;

import com.beasts.board.common.service.PasswordProtectedService;
import com.beasts.board.post.dto.PostReadResponseDTO;
import com.beasts.board.post.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostService extends PasswordProtectedService<Post, Long> {
    PostReadResponseDTO getPostDetails(Long id);
    Page<Post> findAllWithPaging(Pageable pageable);
    Page<Post> search(String keyword, String searchType, Pageable pageable);
    void increaseViewCount(Long id);
}
