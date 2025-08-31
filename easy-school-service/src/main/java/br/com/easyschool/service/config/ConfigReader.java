package br.com.easyschool.service.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class ConfigReader {

    @Autowired
    private Environment env;

    public String getPropertyValue(String propertyName) {
        return env.getProperty(propertyName);
    }
}
