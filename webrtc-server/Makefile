APP_NAME := chattify-webrtc
GO_CMD := go
SRC := ./main.go
OUT := ./bin/$(APP_NAME)


all: run

run: check
	@echo "Running the application..."
	$(GO_CMD) run $(SRC)

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

clean:
	@echo "Cleaning up..."
	@rm -f $(OUT)

deps:
	@echo "Installing dependencies..."
	$(GO_CMD) mod tidy

check: vet fmt test

.PHONY: build run 