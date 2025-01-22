package user

import (
	"github.com/dev-oleksandrv/chattify-api/internal/models"
	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"
)

type UserDto struct {
	ID        uint   `json:"id"`
	Email     string `json:"email"`
	Username  string `json:"username"`
	AvatarURL string `json:"avatarUrl"`
}

func MapModelToUserDto(user *models.User) *UserDto {
	return &UserDto{
		ID:        user.ID,
		Email:     user.Email,
		Username:  user.Username,
		AvatarURL: user.AvatarURL,
	}
}

type CreateUserDto struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}

func (dto CreateUserDto) Validate() error {
	return validation.ValidateStruct(&dto,
		validation.Field(&dto.Email, is.Email, validation.Required),
		validation.Field(&dto.Username, validation.Required, validation.Length(3, 32)),
		validation.Field(&dto.Password, validation.Required, validation.Length(8, 64)),
	)
}
