package com.beasts.board.common.service;

import java.util.List;

public interface CrudService<T, ID> {
    T create(T entity);
    T findById(ID id);
    List<T> findAll();
    T update(T entity);
    void delete(ID id);
}
