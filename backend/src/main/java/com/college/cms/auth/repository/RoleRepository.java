package com.college.cms.auth.repository;

import com.college.cms.auth.entity.Role;
import com.college.cms.auth.entity.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    @Query("SELECT r FROM Role r LEFT JOIN FETCH r.permissions WHERE r.name = :name")
    Optional<Role> findByNameWithPermissions(RoleType name);

    Optional<Role> findByName(RoleType name);

    boolean existsByName(RoleType name);
}
