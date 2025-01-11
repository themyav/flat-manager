package com.rdba.flat_manager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FlatManagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(FlatManagerApplication.class, args);
	}

}
