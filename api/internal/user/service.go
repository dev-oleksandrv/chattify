package user

import (
	"errors"
	"fmt"
	"log/slog"
	"strings"

	"github.com/dev-oleksandrv/chattify-api/internal/models"
	"github.com/dev-oleksandrv/chattify-api/pkg/hash"
)

type UserService struct {
	userRepository *UserRepository
}

func NewUserService(userRepository *UserRepository) *UserService {
	return &UserService{userRepository}
}

func (s *UserService) FindUserByCreds(email, password string) (*models.User, error) {
	user, err := s.userRepository.FindUserByEmail(email)
	if err != nil {
		slog.Error("userService.FindUserByCreds: cannot find user by email", "err", err)
		return nil, err
	}
	if !hash.CheckPasswordHash(password, user.Password) {
		err := errors.New("password check failed")
		slog.Error("userService.FindUserByCreds: passwords check failed", "err", err)
		return nil, err
	}
	return user, nil
}

func (s *UserService) FindUserById(id uint) (*models.User, error) {
	user, err := s.userRepository.FindUserById(id)
	if err != nil {
		slog.Error("userService.FindUserById: cannot find user by id", "err", err)
		return nil, err
	}
	return user, nil
}

func (s *UserService) Create(dto CreateUserDto) (*models.User, error) {
	if err := dto.Validate(); err != nil {
		slog.Error("userService.Create: failed validation", "err", err)
		return nil, err
	}

	hashedPassword, err := hash.HashPassword(dto.Password)
	if err != nil {
		slog.Error("userService.Create: failed password hashing", "err", err)
		return nil, err
	}

	user := &models.User{
		Email:    dto.Email,
		Username: dto.Username,
		Password: hashedPassword,
	}

	if err := s.userRepository.Create(user); err != nil {
		slog.Error("userService.Create: failed to create", "err", err)
		if strings.Contains(err.Error(), "uni_users_email") {
			return nil, fmt.Errorf("user with email %s already exist", user.Email)
		}
		return nil, err
	}

	return user, nil
}
