FROM golang:1.23.2 as builder
WORKDIR /app
COPY ../../ ./

RUN go mod download
RUN make build-webrtc

FROM debian:bullseye-slim
WORKDIR /app
COPY --from=builder /app/bin .
EXPOSE 3478/udp
EXPOSE 3478/tcp

# Run the TURN server binary
CMD ["./chattify-turn"]
