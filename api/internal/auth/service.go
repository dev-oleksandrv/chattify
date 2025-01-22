package auth

import (
	"errors"
	"log/slog"
	"time"

	"github.com/dev-oleksandrv/chattify-api/internal/config"
	"github.com/dev-oleksandrv/chattify-api/internal/user"
	"github.com/golang-jwt/jwt/v5"
)

type AuthService struct {
	cfg         *config.Config
	userService *user.UserService
}

func NewAuthService(cfg *config.Config, userService *user.UserService) *AuthService {
	return &AuthService{cfg, userService}
}

func (s *AuthService) RegisterWithCreds(dto user.CreateUserDto) (*AuthRegisterUserWithCredentialsResponseDto, error) {
	dbUser, err := s.userService.Create(dto)
	if err != nil {
		slog.Error("authService.RegisterWithCreds: cannot create user", "err", err)
		return nil, err
	}

	token, err := s.generateToken(dbUser.ID)
	if err != nil {
		slog.Error("authService.RegisterWithCreds: cannot generate auth token", "err", err)
		return nil, err
	}

	return &AuthRegisterUserWithCredentialsResponseDto{
		User:  user.MapModelToUserDto(dbUser),
		Token: token,
	}, nil
}

func (s *AuthService) LoginWithCreds(dto AuthLoginUserWithCredentialsRequestDto) (*AuthLoginUserWithCredentialsResponseDto, error) {
	if err := dto.Validate(); err != nil {
		slog.Error("authService.LoginWithCreds: failed validation", "err", err)
		return nil, err
	}

	dbUser, err := s.userService.FindUserByCreds(dto.Email, dto.Password)
	if err != nil {
		slog.Error("authService.LoginWithCreds: cannot find user with creds", "err", err)
		return nil, err
	}

	token, err := s.generateToken(dbUser.ID)
	if err != nil {
		slog.Error("authService.LoginWithCreds: cannot generate auth token", "err", err)
		return nil, err
	}

	return &AuthLoginUserWithCredentialsResponseDto{
		User:  user.MapModelToUserDto(dbUser),
		Token: token,
	}, nil
}

func (s *AuthService) VerifyUserWithToken(token string) (*user.UserDto, error) {
	claims, err := s.parseToken(token)
	if err != nil {
		slog.Error("authService.VerifyUserWithToken: cannot parse token", "err", err)
		return nil, err
	}

	dbUser, err := s.userService.FindUserById(claims.UserID)
	if err != nil {
		slog.Error("authService.VerifyUserWithToken: find user by id", "err", err)
		return nil, err
	}

	return user.MapModelToUserDto(dbUser), nil
}

func (s *AuthService) generateToken(userId uint) (string, error) {
	return GenerateJWTTokenFromUser(&GenerateJWTTokenFromUserConfig{
		userId:   userId,
		authType: AuthTypeCredentials,
		provider: "credentials",
		secret:   s.cfg.Auth.Secret,
	})
}

func (s *AuthService) parseToken(jwtToken string) (*AuthClaims, error) {
	token, err := jwt.ParseWithClaims(jwtToken, &AuthClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(s.cfg.Auth.Secret), nil
	})
	if err != nil {
		return nil, err
	}
	if claims, ok := token.Claims.(*AuthClaims); ok && token.Valid {
		if claims.ExpiresAt.Before(time.Now()) {
			return nil, errors.New("token is expired")
		}
		return claims, nil
	}

	return nil, errors.New("invalid token")
}
