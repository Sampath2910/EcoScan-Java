# Build stage
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /home/app
COPY src /home/app/src
COPY pom.xml /home/app
RUN mvn clean package -DskipTests

# Package stage
FROM openjdk:17-jdk-slim
WORKDIR /usr/local/lib
COPY --from=build /home/app/target/ecoscan-backend-1.0.0.jar /usr/local/lib/ecoscan.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/usr/local/lib/ecoscan.jar"]
