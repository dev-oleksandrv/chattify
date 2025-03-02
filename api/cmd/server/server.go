package main

import (
	"fmt"
	"log/slog"
	"os"

	"github.com/dev-oleksandrv/chattify-api/internal/auth"
	"github.com/dev-oleksandrv/chattify-api/internal/config"
	"github.com/dev-oleksandrv/chattify-api/internal/database"
	"github.com/dev-oleksandrv/chattify-api/internal/middleware"
	"github.com/dev-oleksandrv/chattify-api/internal/room"
	"github.com/dev-oleksandrv/chattify-api/internal/ws"
	"github.com/labstack/echo/v4"
	eMiddleware "github.com/labstack/echo/v4/middleware"
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

	authRouter := auth.NewAuthRouter(cfg, db)
	roomRouter := room.NewRoomRouter(db)

	wsHandler := ws.NewWsHandler()

	e := echo.New()
	e.GET("/ws", wsHandler.HandlerFunc)

	e.Use(middleware.CreateLoggerMiddleware())
	e.Use(eMiddleware.CORS())

	apiGroup := e.Group("/api")
	authRouter.AttachRouter(apiGroup)

	protectedGroup := apiGroup.Group("/protected")
	protectedGroup.Use(authRouter.Middleware)
	protectedGroup.GET("/ws/handshake", wsHandler.HandshakeHandlerFunc)
	roomRouter.AttachRouter(protectedGroup, cfg, db)

	go wsHandler.Run()

	e.Logger.Fatal(e.Start(fmt.Sprintf(":%d", cfg.Server.Port)))
}
