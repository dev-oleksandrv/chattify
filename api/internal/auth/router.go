package auth

import (
	"net/http"

	"github.com/dev-oleksandrv/chattify-api/internal/config"
	"github.com/dev-oleksandrv/chattify-api/internal/user"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type AuthRouter struct {
	authService *AuthService
	authHandler *AuthHandler
}

func NewAuthRouter(cfg *config.Config, db *gorm.DB) *AuthRouter {
	userRepository := user.NewUserRepository(db)
	userService := user.NewUserService(userRepository)

	authService := NewAuthService(cfg, userService)
	authHandler := NewAuthHandler(authService)

	return &AuthRouter{authService, authHandler}
}

func (r *AuthRouter) AttachRouter(rootGroup *echo.Group) *echo.Group {
	router := rootGroup.Group("/auth")

	router.POST("/register", r.authHandler.RegisterWithCreds)
	router.POST("/login", r.authHandler.LoginWithCreds)
	router.GET("/verify", r.authHandler.VerifyUser)

	return router
}

func (r *AuthRouter) Middleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		rawHeader := c.Request().Header.Get("Authorization")

		token, err := ParseAuthorizationHeader(rawHeader)
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, "invalid authorization header")
		}

		user, err := r.authService.VerifyUserWithToken(token)
		if err != nil {
			return echo.NewHTTPError(http.StatusForbidden, "token is invalid")
		}

		c.Set(AuthUserDataContextKey, user)

		return next(c)
	}
}
