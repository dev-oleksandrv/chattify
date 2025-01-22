package config_test

import (
	"testing"

	"github.com/dev-oleksandrv/chattify-api/internal/config"
	"github.com/stretchr/testify/assert"
)

func TestLoadConfig_WithTestEnv(t *testing.T) {
	config, err := config.LoadConfig("./../../environment/.env.test")

	assert.NoError(t, err)
	assert.NotNil(t, config)
	assert.Equal(t, "test", config.Server.Env)
	assert.Equal(t, 8000, config.Server.Port)
	assert.Equal(t, "localhost", config.Database.Host)
	assert.Equal(t, 5432, config.Database.Port)
	assert.Equal(t, "postgres", config.Database.Username)
	assert.Equal(t, "postgres", config.Database.Password)
	assert.Equal(t, "test-db", config.Database.Name)
	assert.Equal(t, "secret", config.Auth.Secret)
}
