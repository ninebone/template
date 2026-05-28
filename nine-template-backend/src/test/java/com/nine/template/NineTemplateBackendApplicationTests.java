package com.nine.template;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan(basePackages = {"com.nine.template", "com.ninelab.ai"})
@SpringBootTest
class NineTemplateBackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
