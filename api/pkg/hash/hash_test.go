package hash_test

import (
	"bytes"
	"testing"

	"github.com/dev-oleksandrv/chattify-api/pkg/hash"
	"github.com/stretchr/testify/assert"
)

func TestHashPassword_ReturnHash(t *testing.T) {
	arg := string(bytes.Repeat([]byte("a"), 72))
	val, err := hash.HashPassword(arg)

	assert.NoError(t, err)
	assert.NotZero(t, val)
}

func TestHashPassword_ReturnError(t *testing.T) {
	arg := string(bytes.Repeat([]byte("a"), 73))
	val, err := hash.HashPassword(arg)

	assert.Error(t, err)
	assert.Zero(t, val)
}

func TestCheckPasswordHash_ReturnTrue(t *testing.T) {
	hashedVal, _ := hash.HashPassword("test")
	result := hash.CheckPasswordHash("test", hashedVal)

	assert.Equal(t, result, true)
}

func TestCheckPasswordHash_ReturnFalse(t *testing.T) {
	hashedVal, _ := hash.HashPassword("test")
	result := hash.CheckPasswordHash("test_2", hashedVal)

	assert.Equal(t, result, false)
}
