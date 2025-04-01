package com.audit;

import org.springframework.data.domain.Pageable;
import java.util.Date;
import java.util.List;
import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
@Transactional
public interface AuditRepository extends JpaRepository<Audit, Long> {
    
    @Query(value = "select u from Audit u where date BETWEEN ?1 AND ?2 AND (?3 is null or u.entityIdentifier like concat('%' , ?3 , '%'))  order by u.id desc ")
    List<Audit> findAll(Date start, Date end, String entityName);

    @Query(value = "select u from Audit u where date BETWEEN ?1 AND ?2 AND (?3 is null or u.entityIdentifier like concat('%' , ?3 , '%'))  order by u.id desc ")
    Page<Audit> findAllPaginated(Date start, Date end, String entityName, Pageable pageable);
}
