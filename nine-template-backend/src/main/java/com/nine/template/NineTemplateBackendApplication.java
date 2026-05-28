package com.nine.template;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan(basePackages = {"com.nine.template", "com.ninelab.ai"})
@SpringBootApplication
public class NineTemplateBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(NineTemplateBackendApplication.class, args);
	}

}
