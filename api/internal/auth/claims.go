package auth

import (
	"github.com/golang-jwt/jwt/v5"
)

type AuthType string

type AuthClaims struct {
	UserID   uint     `json:"user_id"`
	AuthType AuthType `json:"auth_type"`
	Provider string   `json:"provider,omitempty"`
	jwt.RegisteredClaims
}

const (
	AuthTypeCredentials AuthType = "credentials"
	AuthTypeOAuth       AuthType = "oauth"
)
