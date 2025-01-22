package auth

import (
	"github.com/dev-oleksandrv/chattify-api/internal/config"
	"github.com/dev-oleksandrv/chattify-api/internal/user"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func AttachRouter(rootGroup *echo.Group, cfg *config.Config, db *gorm.DB) *echo.Group {
	userRepository := user.NewUserRepository(db)
	userService := user.NewUserService(userRepository)

	service := NewAuthService(cfg, userService)
	handler := NewAuthHandler(service)

	router := rootGroup.Group("/auth")

	router.POST("/register", handler.RegisterWithCreds)
	router.POST("/login", handler.LoginWithCreds)
	router.GET("/verify", handler.VerifyUser)

	return router
}
