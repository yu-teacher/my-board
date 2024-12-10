package com.beasts.board.admin.service;

import com.beasts.board.admin.entity.Admin;

public interface AdminService {
    Admin login(String username, String password);
    Admin createAdmin(Admin admin);
    String createToken(Admin admin);
    void deletePost(Long postId);
    void deleteComment(Long commentId);
}
