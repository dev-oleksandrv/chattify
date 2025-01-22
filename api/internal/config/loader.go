package config

import (
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

func LoadConfig() (*Config, error) {
	err := godotenv.Load("environment/.env")
	if err != nil {
		return nil, err
	}

	var config Config

	config.Server.Env = os.Getenv("SERVER_ENV")
	config.Server.Port, _ = strconv.Atoi(os.Getenv("SERVER_PORT"))

	config.Database.Host = os.Getenv("DATABASE_HOST")
	config.Database.Port, _ = strconv.Atoi(os.Getenv("DATABASE_PORT"))
	config.Database.Username = os.Getenv("DATABASE_USERNAME")
	config.Database.Password = os.Getenv("DATABASE_PASSWORD")
	config.Database.Name = os.Getenv("DATABASE_NAME")

	return &config, nil
}
