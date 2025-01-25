FROM golang:1.23.2 as builder
WORKDIR /app
COPY ./go.mod ./go.sum ./
RUN go mod download
COPY ./ ./
RUN make build

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/bin/chattify-webrtc /chattify-webrtc
EXPOSE 3478/udp
EXPOSE 3478/tcp
CMD ["./chattify-webrtc"]