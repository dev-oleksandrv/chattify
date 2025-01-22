package config

import (
	"fmt"
	"os"
	"strconv"
)

func GetEnvVar(key string) (string, error) {
	val := os.Getenv(key)
	if val == "" {
		return "", fmt.Errorf("cannot retreive env var: %s", key)
	}

	return val, nil
}

func GetEnvVarInt(key string) (int, error) {
	val, err := GetEnvVar(key)
	if err != nil {
		return 0, err
	}

	intVal, err := strconv.Atoi(val)
	if err != nil {
		return 0, fmt.Errorf("cannot convert string env var to int: %s:%s", key, val)
	}

	return intVal, nil
}

func MustGetEnvVar(key string) string {
	val, err := GetEnvVar(key)
	if err != nil {
		panic(err)
	}
	return val
}

func MustGetEnvVarInt(key string) int {
	intVal, err := GetEnvVarInt(key)
	if err != nil {
		panic(err)
	}
	return intVal
}

func GetEnvVarWithFallback(key, fallback string) string {
	val, err := GetEnvVar(key)
	if err != nil {
		return fallback
	}
	return val
}

func GetEnvVarIntWithFallback(key string, fallback int) int {
	intVal, err := GetEnvVarInt(key)
	if err != nil {
		return fallback
	}
	return intVal
}
