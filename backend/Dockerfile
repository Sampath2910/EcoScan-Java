# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /home/app
COPY src /home/app/src
COPY pom.xml /home/app
RUN mvn clean package -DskipTests

# Package stage
FROM eclipse-temurin:17-jre
WORKDIR /usr/local/lib
COPY --from=build /home/app/target/ecoscan-backend-1.0.0.jar /usr/local/lib/ecoscan.jar
EXPOSE 8080

# Pre-download PyTorch model to ensure instant startup in production
RUN mkdir -p /usr/local/lib/model_cache && \
    apt-get update && apt-get install -y wget && \
    wget -O /usr/local/lib/model_cache/waste_classifier_scripted.pt "https://huggingface.co/Sampath2910/EcoScan-Classifier/resolve/main/waste_classifier_scripted.pt?download=true" && \
    apt-get purge -y wget && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["java","-jar","/usr/local/lib/ecoscan.jar"]
