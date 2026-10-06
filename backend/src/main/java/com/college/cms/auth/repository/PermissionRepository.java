package com.college.cms.auth.repository;

import com.college.cms.auth.entity.Permission;
import com.college.cms.auth.entity.PermissionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    Optional<Permission> findByName(PermissionType name);
    boolean existsByName(PermissionType name);
}
