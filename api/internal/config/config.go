package config

type ServerConfig struct {
	Port int
	Env  string
}

type DatabaseConfig struct {
	Host     string
	Port     int
	Username string
	Password string
	Name     string
}

type AuthConfig struct {
	Secret string
}

type Config struct {
	Auth     AuthConfig
	Server   ServerConfig
	Database DatabaseConfig
}
