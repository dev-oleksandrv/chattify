package config

import (
	"log/slog"

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

	config.Server.Env = GetEnvVarWithFallback("SERVER_ENV", "development")
	config.Server.Port = GetEnvVarIntWithFallback("SERVER_PORT", 8000)

	config.Database.Host = MustGetEnvVar("DATABASE_HOST")
	config.Database.Port = MustGetEnvVarInt("DATABASE_PORT")
	config.Database.Username = MustGetEnvVar("DATABASE_USERNAME")
	config.Database.Password = MustGetEnvVar("DATABASE_PASSWORD")
	config.Database.Name = MustGetEnvVar("DATABASE_NAME")

	return &config, nil
}
