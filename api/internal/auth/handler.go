package auth

import (
	"net/http"
	"strings"

	"github.com/dev-oleksandrv/chattify-api/internal/user"
	"github.com/labstack/echo/v4"
)

type AuthHandler struct {
	authService *AuthService
}

func NewAuthHandler(authService *AuthService) *AuthHandler {
	return &AuthHandler{authService}
}

func (h *AuthHandler) RegisterWithCreds(c echo.Context) error {
	input := new(user.CreateUserDto)
	if err := c.Bind(input); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	response, err := h.authService.RegisterWithCreds(*input)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusCreated, response)
}

func (h *AuthHandler) LoginWithCreds(c echo.Context) error {
	input := new(AuthLoginUserWithCredentialsRequestDto)
	if err := c.Bind(input); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	response, err := h.authService.LoginWithCreds(*input)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, response)
}

func (h *AuthHandler) VerifyUser(c echo.Context) error {
	header := c.Request().Header.Get("Authorization")
	if header == "" {
		return echo.NewHTTPError(http.StatusUnauthorized, "no authorization header")
	}

	parts := strings.SplitN(header, " ", 2)
	if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
		return echo.NewHTTPError(http.StatusUnauthorized, "invalid authorization header")
	}

	user, err := h.authService.VerifyUserWithToken(parts[1])
	if err != nil {
		return echo.NewHTTPError(http.StatusForbidden, "token is invalid")
	}

	return c.JSON(http.StatusOK, user)
}
