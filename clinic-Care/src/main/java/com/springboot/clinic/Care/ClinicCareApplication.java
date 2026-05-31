package com.springboot.clinic.Care;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
@EnableScheduling
@SpringBootApplication
public class ClinicCareApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClinicCareApplication.class, args);
	}


}
