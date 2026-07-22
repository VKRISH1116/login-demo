package com.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Arrays;
import java.util.List;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		checkRequiredEnv();
		SpringApplication.run(BackendApplication.class, args);
	}

	/**
	 * Fail fast with a clear message if the required secrets aren't in the environment,
	 * instead of Spring's cryptic "Could not resolve placeholder 'JWT_SECRET'" error.
	 */
	private static void checkRequiredEnv() {
		List<String> missing = Arrays.stream(new String[]{"JWT_SECRET", "DB_PASSWORD"})
				.filter(name -> {
					String value = System.getenv(name);
					return value == null || value.isBlank();
				})
				.toList();

		if (!missing.isEmpty()) {
			System.err.println("""

					============================================================
					  Cannot start: missing required environment variable(s):
					    %s

					  These secrets are NOT stored in the code. Provide them via
					  the project-root .env file and start with the helper:

					    cd backend
					    ./run-dev.ps1        (loads .env, then runs the app)

					  First time? Copy .env.example to .env and fill it in.
					  (Don't run "mvnw spring-boot:run" directly — it has no secrets.)
					============================================================
					""".formatted(String.join(", ", missing)));
			System.exit(1);
		}
	}

}
