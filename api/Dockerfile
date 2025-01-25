FROM golang:1.23.2-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY ./ .
RUN go build -o chattify-server ./cmd/server

FROM alpine:latest
COPY --from=builder /app/chattify-server /chattify-server
EXPOSE 8000
CMD ["/chattify-server"]