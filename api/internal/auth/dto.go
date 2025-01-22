package auth

import (
	"github.com/dev-oleksandrv/chattify-api/internal/user"
	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/go-ozzo/ozzo-validation/is"
)

type AuthRegisterUserWithCredentialsResponseDto struct {
	User  *user.UserDto `json:"user"`
	Token string        `json:"token"`
}

type AuthLoginUserWithCredentialsRequestDto struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (dto AuthLoginUserWithCredentialsRequestDto) Validate() error {
	return validation.ValidateStruct(&dto,
		validation.Field(&dto.Email, is.Email, validation.Required),
		validation.Field(&dto.Password, validation.Required, validation.Length(8, 64)),
	)
}

type AuthLoginUserWithCredentialsResponseDto struct {
	User  *user.UserDto `json:"user"`
	Token string        `json:"token"`
}
