package auth

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type GenerateJWTTokenFromUserConfig struct {
	userId   uint
	authType AuthType
	provider string
	secret   string
}

func GenerateJWTTokenFromUser(cfg *GenerateJWTTokenFromUserConfig) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, AuthClaims{
		UserID:   cfg.userId,
		AuthType: cfg.authType,
		Provider: cfg.provider,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Subject:   "user-authentication",
		},
	})
	signedToken, err := token.SignedString([]byte(cfg.secret))
	if err != nil {
		return "", err
	}
	return signedToken, nil
}
