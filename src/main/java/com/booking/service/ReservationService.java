package com.booking.service;

import com.booking.dto.ReservationRequest;
import com.booking.dto.ReservationResponse;
import com.booking.entity.Reservation;
import com.booking.entity.ReservationStatus;
import com.booking.entity.Resource;
import com.booking.entity.Role;
import com.booking.entity.User;
import com.booking.exception.ReservationNotFoundException;
import com.booking.exception.ResourceNotFoundException;
import com.booking.repository.ReservationRepository;
import com.booking.repository.ResourceRepository;
import com.booking.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    public ReservationService(
            ReservationRepository reservationRepository,
            ResourceRepository resourceRepository,
            UserRepository userRepository) {

        this.reservationRepository = reservationRepository;
        this.resourceRepository = resourceRepository;
        this.userRepository = userRepository;
    }

    // =========================
    // CREATE RESERVATION
    // =========================

    public ReservationResponse createReservation(
            ReservationRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Resource resource = resourceRepository
                .findById(request.getResourceId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Resource not found with id: "
                                        + request.getResourceId()));

        if (!request.getEndTime()
                .isAfter(request.getStartTime())) {

            throw new RuntimeException(
                    "End time must be after start time");
        }

        if (!Boolean.TRUE.equals(resource.getAvailable())) {

            throw new RuntimeException(
                    "Resource is currently unavailable");
        }

        boolean overlappingReservation =
                reservationRepository
                        .existsOverlappingReservation(
                                resource.getId(),
                                request.getStartTime(),
                                request.getEndTime(),
                                ReservationStatus.CANCELLED
                        );

        if (overlappingReservation) {
            throw new RuntimeException(
                    "Resource is already reserved for the selected time");
        }

        Reservation reservation = new Reservation();

        reservation.setResource(resource);
        reservation.setUser(user);
        reservation.setStartTime(request.getStartTime());
        reservation.setEndTime(request.getEndTime());
        reservation.setPrice(resource.getPrice());
        reservation.setStatus(
                ReservationStatus.PENDING
        );

        Reservation savedReservation =
                reservationRepository.save(reservation);

        return ReservationResponse.fromEntity(
                savedReservation
        );
    }

    // =========================
    // GET RESERVATIONS
    // =========================

    public Page<ReservationResponse> getReservations(
            Authentication authentication,
            ReservationStatus status,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            int page,
            int size,
            String sortBy,
            String direction) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Sort.Direction sortDirection;

        try {
            sortDirection =
                    Sort.Direction.fromString(direction);

        } catch (IllegalArgumentException ex) {

            sortDirection =
                    Sort.Direction.ASC;
        }

        Sort sort =
                Sort.by(sortDirection, sortBy);

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        sort
                );

        Page<Reservation> reservations;

        if (user.getRole() == Role.ADMIN) {

            reservations =
                    reservationRepository.findWithFilters(
                            status,
                            minPrice,
                            maxPrice,
                            pageable
                    );

        } else {

            reservations =
                    reservationRepository.findUserReservations(
                            user.getId(),
                            status,
                            minPrice,
                            maxPrice,
                            pageable
                    );
        }

        return reservations.map(
                ReservationResponse::fromEntity
        );
    }

    // =========================
    // GET RESERVATION BY ID
    // =========================

    public ReservationResponse getReservationById(
            Long id,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Reservation reservation =
                reservationRepository.findById(id)
                        .orElseThrow(() ->
                                new ReservationNotFoundException(
                                        "Reservation not found with id: "
                                                + id));

        if (user.getRole() == Role.USER &&
                !reservation.getUser()
                        .getId()
                        .equals(user.getId())) {

            throw new AccessDeniedException(
                    "You are not authorized to view this reservation");
        }

        return ReservationResponse.fromEntity(
                reservation
        );
    }

    // =========================
    // ADMIN UPDATE STATUS
    // =========================

    public ReservationResponse updateReservationStatus(
            Long id,
            ReservationStatus status) {

        Reservation reservation =
                reservationRepository.findById(id)
                        .orElseThrow(() ->
                                new ReservationNotFoundException(
                                        "Reservation not found with id: "
                                                + id));

        reservation.setStatus(status);

        Reservation updatedReservation =
                reservationRepository.save(
                        reservation
                );

        return ReservationResponse.fromEntity(
                updatedReservation
        );
    }

    // =========================
    // USER CANCEL RESERVATION
    // =========================

    public ReservationResponse cancelReservation(
            Long id,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Reservation reservation =
                reservationRepository.findById(id)
                        .orElseThrow(() ->
                                new ReservationNotFoundException(
                                        "Reservation not found with id: "
                                                + id));

        // USER can cancel only their own reservation
        if (user.getRole() == Role.USER &&
                !reservation.getUser()
                        .getId()
                        .equals(user.getId())) {

            throw new AccessDeniedException(
                    "You are not authorized to cancel this reservation");
        }

        // Already cancelled
        if (reservation.getStatus() ==
                ReservationStatus.CANCELLED) {

            throw new RuntimeException(
                    "Reservation is already cancelled");
        }

        reservation.setStatus(
                ReservationStatus.CANCELLED
        );

        Reservation updatedReservation =
                reservationRepository.save(
                        reservation
                );

        return ReservationResponse.fromEntity(
                updatedReservation
        );
    }
}