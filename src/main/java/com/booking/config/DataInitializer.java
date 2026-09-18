package com.booking.config;

import com.booking.entity.Role;
import com.booking.entity.User;
import com.booking.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeUsers(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (!userRepository.existsByEmail("admin@gmail.com")) {

                User admin = new User();

                admin.setUsername("admin");
                admin.setEmail("admin@gmail.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);

                userRepository.save(admin);
            }

            if (!userRepository.existsByEmail("user@gmail.com")) {

                User user = new User();

                user.setUsername("user");
                user.setEmail("user@gmail.com");
                user.setPassword(passwordEncoder.encode("user123"));
                user.setRole(Role.USER);

                userRepository.save(user);
            }
        };
    }
}