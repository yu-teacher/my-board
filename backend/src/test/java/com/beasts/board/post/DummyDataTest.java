package com.beasts.board.post;

import com.beasts.board.admin.entity.Admin;
import com.beasts.board.admin.service.AdminService;
import com.beasts.board.post.entity.Post;
import com.beasts.board.post.service.PostService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Random;

@SpringBootTest
public class DummyDataTest {

    @Autowired
    private PostService postService;

    @Autowired
    private AdminService adminService;

    @Test
    @DisplayName("더미데이터 생성")
    void dummyDataCreate(){
        String[] subjects = {"Spring", "Java", "JavaScript", "TypeScript", "React", "Vue", "Angular", "Svelte"};
        String[] contents = {"공부중입니다", "어려워요", "재미있어요", "궁금한게 있어요", "도와주세요", "좋은 자료 있나요?"};
        String[] nicknames = {"개발자", "코더", "프로그래머", "학생", "취준생", "시니어"};

        Random random = new Random();

        for(int i = 1; i <= 300; i++) {
            String title = subjects[random.nextInt(subjects.length)] + " " +
                    subjects[random.nextInt(subjects.length)] + " " +
                    (random.nextInt(100) + 1) + "번째 게시글";

            String content = contents[random.nextInt(contents.length)] + " " +
                    contents[random.nextInt(contents.length)] + " " +
                    "게시글 내용 " + i;

            String nickname = nicknames[random.nextInt(nicknames.length)] + (random.nextInt(100) + 1);

            Post post = Post.builder()
                    .title(title)
                    .content(content)
                    .nickname(nickname)
                    .build();

            postService.createWithPassword(post, "test1234");
        }
    }

    @Test
    @DisplayName("어드민 아이디")
    void createAdmin(){
        adminService.createAdmin(new Admin("admin","8429317"));
    }
}
