APP_NAME := chattify-server
WEBRTC_APP_NAME := chattify-turn
GO_CMD := go

SRC := ./cmd/server/server.go
OUT := ./bin/$(APP_NAME)

WEBRTC_SRC := ./cmd/webrtc/webrtc.go
WEBRTC_OUT := ./bin/$(WEBRTC_APP_NAME)

all: run

run: check
	@echo "Running the application..."
	$(GO_CMD) run $(SRC)

run-webrtc: check
	@echo "Running webrtc server..."
	$(GO_CMD) run $(WEBRTC_SRC)

vet:
	@echo "Running go vet..."
	$(GO_CMD) vet ./...

fmt:
	@echo "Formatting code..."
	$(GO_CMD) fmt ./...

test:
	@echo "Running tests..."
	$(GO_CMD) test ./... -v

build:
	@echo "Building the application..."
	$(GO_CMD) build -o $(OUT) $(SRC)

build-webrtc:
	@echo "Building WebRTC server..."
	$(GO_CMD) build -o $(WEBRTC_OUT) $(WEBRTC_SRC)

clean:
	@echo "Cleaning up..."
	@rm -f $(OUT)

deps:
	@echo "Installing dependencies..."
	$(GO_CMD) mod tidy

check: vet fmt test

.PHONY: build run 