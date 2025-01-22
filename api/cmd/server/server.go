package main

import (
	"fmt"
	"log/slog"
	"os"

	"github.com/dev-oleksandrv/chattify-api/internal/auth"
	"github.com/dev-oleksandrv/chattify-api/internal/config"
	"github.com/dev-oleksandrv/chattify-api/internal/database"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
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

	e := echo.New()

	e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
		LogStatus: true,
		LogURI:    true,
		LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
			slog.Info("REQUEST", "uri", v.URI, "status", v.Status)
			return nil
		},
	}))

	apiGroup := e.Group("/api")

	auth.AttachRouter(apiGroup, cfg, db)

	e.Logger.Fatal(e.Start(fmt.Sprintf(":%d", cfg.Server.Port)))
}
