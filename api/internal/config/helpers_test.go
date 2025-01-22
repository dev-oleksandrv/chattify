package config_test

import (
	"os"
	"testing"

	"github.com/dev-oleksandrv/chattify-api/internal/config"
	"github.com/stretchr/testify/assert"
)

func TestGetEnvVar_RetreiveEnvVar(t *testing.T) {
	os.Setenv("TEST_KEY", "test")
	defer func() { os.Unsetenv("TEST_KEY") }()

	val, err := config.GetEnvVar("TEST_KEY")

	assert.NoError(t, err)
	assert.Equal(t, val, "test")
}

func TestGetEnvVar_ReturnErrorNoKey(t *testing.T) {
	val, err := config.GetEnvVar("NOTEXIST_TEST_KEY")

	assert.Error(t, err)
	assert.Zero(t, val)
}

func TestGetEnvVarInt_RetreiveEnvVar(t *testing.T) {
	os.Setenv("TEST_KEY", "25")
	defer func() { os.Unsetenv("TEST_KEY") }()

	val, err := config.GetEnvVarInt("TEST_KEY")

	assert.NoError(t, err)
	assert.Equal(t, val, 25)
}

func TestGetEnvVarInt_ReturnErrorNoKey(t *testing.T) {
	val, err := config.GetEnvVarInt("NOTEXIST_TEST_KEY")

	assert.Error(t, err)
	assert.Zero(t, val)
}

func TestGetEnvVarInt_ReturnErrorInvalidValue(t *testing.T) {
	os.Setenv("TEST_KEY", "invalid_number")
	defer func() { os.Unsetenv("TEST_KEY") }()

	val, err := config.GetEnvVarInt("TEST_KEY")

	assert.Error(t, err)
	assert.Zero(t, val)
}

func TestMustGetEnvVar_ShouldPanic(t *testing.T) {
	assert.Panics(t, func() { config.MustGetEnvVar("NOTEXIST_TEST_KEY") })
}

func TestMustGetEnvVarInt_ShouldPanic(t *testing.T) {
	assert.Panics(t, func() { config.MustGetEnvVarInt("NOTEXIST_TEST_KEY") })
}

func TestGetEnvVarWithFallback_ReturnFallback(t *testing.T) {
	val := config.GetEnvVarWithFallback("TEST_KEY", "fallback")
	assert.Equal(t, val, "fallback")
}

func TestGetEnvVarWithFallback_ReturnEnvVal(t *testing.T) {
	os.Setenv("TEST_KEY", "test")
	defer func() { os.Unsetenv("TEST_KEY") }()
	val := config.GetEnvVarWithFallback("TEST_KEY", "fallback")
	assert.Equal(t, val, "test")
}

func TestGetEnvVarIntWithFallback_ReturnFallback(t *testing.T) {
	val := config.GetEnvVarIntWithFallback("TEST_KEY", 2000)
	assert.Equal(t, val, 2000)
}

func TestGetEnvVarIntWithFallback_ReturnEnvVal(t *testing.T) {
	os.Setenv("TEST_KEY", "24")
	defer func() { os.Unsetenv("TEST_KEY") }()
	val := config.GetEnvVarIntWithFallback("TEST_KEY", 25)
	assert.Equal(t, val, 24)
}
