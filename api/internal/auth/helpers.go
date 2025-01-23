package auth

import (
	"errors"
	"fmt"
	"strings"
)

func ParseAuthorizationHeader(header string) (string, error) {
	if header == "" {
		return "", errors.New("header value is empty")
	}

	parts := strings.SplitN(header, " ", 2)
	if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
		return "", fmt.Errorf("invalid header value format: %s", header)
	}

	return parts[1], nil
}
