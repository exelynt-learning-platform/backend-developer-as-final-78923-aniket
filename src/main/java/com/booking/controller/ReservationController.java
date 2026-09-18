package com.booking.controller;

import com.booking.dto.ReservationRequest;
import com.booking.dto.ReservationResponse;
import com.booking.entity.ReservationStatus;
import com.booking.service.ReservationService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(
            ReservationService reservationService) {

        this.reservationService = reservationService;
    }

    // =========================
    // CREATE RESERVATION
    // =========================

    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(
            @Valid @RequestBody ReservationRequest request,
            Authentication authentication) {

        ReservationResponse response =
                reservationService.createReservation(
                        request,
                        authentication
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // =========================
    // GET RESERVATIONS
    // =========================

    @GetMapping
    public ResponseEntity<Page<ReservationResponse>> getReservations(
            Authentication authentication,

            @RequestParam(required = false)
            ReservationStatus status,

            @RequestParam(required = false)
            BigDecimal minPrice,

            @RequestParam(required = false)
            BigDecimal maxPrice,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "startTime")
            String sortBy,

            @RequestParam(defaultValue = "ASC")
            String direction) {

        Page<ReservationResponse> response =
                reservationService.getReservations(
                        authentication,
                        status,
                        minPrice,
                        maxPrice,
                        page,
                        size,
                        sortBy,
                        direction
                );

        return ResponseEntity.ok(response);
    }

    // =========================
    // GET RESERVATION BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponse> getReservationById(
            @PathVariable Long id,
            Authentication authentication) {

        ReservationResponse response =
                reservationService.getReservationById(
                        id,
                        authentication
                );

        return ResponseEntity.ok(response);
    }

    // =========================
    // ADMIN UPDATE STATUS
    // =========================

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReservationResponse> updateReservationStatus(
            @PathVariable Long id,
            @RequestParam ReservationStatus status) {

        ReservationResponse response =
                reservationService.updateReservationStatus(
                        id,
                        status
                );

        return ResponseEntity.ok(response);
    }

    // =========================
    // USER CANCEL RESERVATION
    // =========================

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ReservationResponse> cancelReservation(
            @PathVariable Long id,
            Authentication authentication) {

        ReservationResponse response =
                reservationService.cancelReservation(
                        id,
                        authentication
                );

        return ResponseEntity.ok(response);
    }
}