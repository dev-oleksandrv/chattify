package main

import (
	"log/slog"
	"os"

	"github.com/dev-oleksandrv/chattify-api/internal/config"
	"github.com/dev-oleksandrv/chattify-api/internal/database"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		slog.Error("failed to load environment", "err", err)
		os.Exit(1)
	}

	db, err := database.New(cfg)
	if err != nil {
		slog.Error("failed to connect to db", "err", err)
		os.Exit(1)
	}

	if err := database.AutoMigrate(db); err != nil {
		slog.Error("failed to auto-migrate", "err", err)
		os.Exit(1)
	}

	slog.Info("program is running")
}
