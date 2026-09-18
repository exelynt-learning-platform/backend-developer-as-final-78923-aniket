package com.booking.repository;

import com.booking.entity.Reservation;
import com.booking.entity.ReservationStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface ReservationRepository
        extends JpaRepository<Reservation, Long> {

    @Query("""
        SELECT r FROM Reservation r
        WHERE (:status IS NULL OR r.status = :status)
        AND (:minPrice IS NULL OR r.price >= :minPrice)
        AND (:maxPrice IS NULL OR r.price <= :maxPrice)
        """)
    Page<Reservation> findWithFilters(
            @Param("status") ReservationStatus status,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );

    @Query("""
        SELECT r FROM Reservation r
        WHERE r.user.id = :userId
        AND (:status IS NULL OR r.status = :status)
        AND (:minPrice IS NULL OR r.price >= :minPrice)
        AND (:maxPrice IS NULL OR r.price <= :maxPrice)
        """)
    Page<Reservation> findUserReservations(
            @Param("userId") Long userId,
            @Param("status") ReservationStatus status,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );

    // Check for overlapping active reservations
    @Query("""
        SELECT COUNT(r) > 0
        FROM Reservation r
        WHERE r.resource.id = :resourceId
        AND r.status <> :cancelledStatus
        AND r.startTime < :endTime
        AND r.endTime > :startTime
        """)
    boolean existsOverlappingReservation(
            @Param("resourceId") Long resourceId,
            @Param("startTime") java.time.LocalDateTime startTime,
            @Param("endTime") java.time.LocalDateTime endTime,
            @Param("cancelledStatus") ReservationStatus cancelledStatus
    );
}