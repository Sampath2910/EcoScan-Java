# Build stage
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /home/app
COPY src /home/app/src
COPY pom.xml /home/app
RUN mvn clean package -DskipTests

# Package stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /usr/local/lib
COPY --from=build /home/app/target/ecoscan-backend-1.0.0.jar /usr/local/lib/ecoscan.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/usr/local/lib/ecoscan.jar"]
