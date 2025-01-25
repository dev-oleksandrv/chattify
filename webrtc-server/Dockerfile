FROM golang:1.23.2-alpine as builder
WORKDIR /app
COPY ./go.mod ./go.sum ./
RUN go mod download
COPY ./ .
RUN go build -o ./bin/chattify-webrtc ./main.go

FROM alpine:latest
COPY --from=builder /app/bin/chattify-webrtc /chattify-webrtc
EXPOSE 3478/udp
EXPOSE 3478/tcp
CMD ["/chattify-webrtc"]
