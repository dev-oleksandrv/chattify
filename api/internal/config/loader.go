package config

import (
	"log/slog"

	cfgHelpers "github.com/dev-oleksandrv/chattify-api/pkg/config"
	"github.com/joho/godotenv"
)

func LoadConfig(filename ...string) (*Config, error) {
	pathToEnvFile := "environment/.env"
	if len(filename) > 0 {
		pathToEnvFile = filename[0]
	}

	err := godotenv.Load(pathToEnvFile)
	if err != nil {
		slog.Warn("env file is not found", "msg", err)
	}

	var config Config

	config.Server.Env = cfgHelpers.GetEnvVarWithFallback("SERVER_ENV", "development")
	config.Server.Port = cfgHelpers.GetEnvVarIntWithFallback("SERVER_PORT", 8000)

	config.Database.Host = cfgHelpers.MustGetEnvVar("DATABASE_HOST")
	config.Database.Port = cfgHelpers.MustGetEnvVarInt("DATABASE_PORT")
	config.Database.Username = cfgHelpers.MustGetEnvVar("DATABASE_USERNAME")
	config.Database.Password = cfgHelpers.MustGetEnvVar("DATABASE_PASSWORD")
	config.Database.Name = cfgHelpers.MustGetEnvVar("DATABASE_NAME")

	config.Auth.Secret = cfgHelpers.MustGetEnvVar("AUTH_SECRET")

	return &config, nil
}
