# Linux x64
#FROM ubuntu:22.04
FROM adoptopenjdk/openjdk13:latest

LABEL org.opencontainers.image.title="JBL docker image" \
      org.opencontainers.image.description="Hosts JBL application" \
      org.opencontainers.image.authors="daniele.bertocchi@hubparking.com"

# Create directory in container image for app code
RUN mkdir -p /opt/jbl
RUN mkdir -p /opt/jbl/jbllog
RUN chmod 777 -R /opt/jbl

# ----------------------------------------


# Set working directory context
WORKDIR /opt/jbl

# Install dependencies from apt repo
#RUN apt-get update && 



