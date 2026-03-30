# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

ENV COUPONS_STORAGE_BASE_DIR=/app/temp

RUN mkdir -p /app/temp
VOLUME /app/temp

EXPOSE 8031
ENTRYPOINT ["java", "-jar", "app.jar"]
