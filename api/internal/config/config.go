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

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
}
