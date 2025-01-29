package com.koushik.redditclone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.koushik.redditclone.model.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
