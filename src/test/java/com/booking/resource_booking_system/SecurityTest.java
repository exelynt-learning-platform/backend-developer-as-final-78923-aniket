package com.booking;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.security.test.context.support.WithMockUser;

import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SecurityTest {

    @Autowired
    private MockMvc mockMvc;

    // Test 1:
    // Without authentication, protected endpoint
    // should return 401 Unauthorized.
    @Test
    void unauthenticatedUserCannotCreateResource() throws Exception {

        mockMvc.perform(
                        post("/resources")
                                .contentType("application/json")
                                .content("""
                            {
                                "name": "Test Room",
                                "description": "Test Description",
                                "type": "ROOM",
                                "available": true,
                                "price": 500
                            }
                            """)
                )
                .andExpect(status().isUnauthorized());
    }

    // Test 2:
    // USER should not be allowed to create resources.
    @Test
    @WithMockUser(username = "user@gmail.com", roles = "USER")
    void userCannotCreateResource() throws Exception {

        mockMvc.perform(
                        post("/resources")
                                .contentType("application/json")
                                .content("""
                            {
                                "name": "Test Room",
                                "description": "Test Description",
                                "type": "ROOM",
                                "available": true,
                                "price": 500
                            }
                            """)
                )
                .andExpect(status().isForbidden());
    }

    // Test 3:
    // USER should not be allowed to change reservation status.
    @Test
    @WithMockUser(username = "user@gmail.com", roles = "USER")
    void userCannotChangeReservationStatus() throws Exception {

        mockMvc.perform(
                        put("/reservations/1/status")
                                .param("status", "CONFIRMED")
                )
                .andExpect(status().isForbidden());
    }

    // Test 4:
    // ADMIN should be allowed to access the
    // ADMIN-only resource endpoint.
    @Test
    @WithMockUser(username = "admin@gmail.com", roles = "ADMIN")
    void adminCanAccessCreateResourceEndpoint() throws Exception {

        mockMvc.perform(
                        post("/resources")
                                .contentType("application/json")
                                .content("""
                            {
                                "name": "Test Room",
                                "description": "Test Description",
                                "type": "ROOM",
                                "available": true,
                                "price": 500
                            }
                            """)
                )
                .andExpect(status().isCreated());
    }
}