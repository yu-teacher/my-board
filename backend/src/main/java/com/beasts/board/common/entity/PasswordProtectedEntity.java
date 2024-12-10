package com.beasts.board.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@Setter
@MappedSuperclass
@Getter
public abstract class PasswordProtectedEntity extends BaseTimeEntity {
    @Column(nullable = false)
    protected String password;

}
