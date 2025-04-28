-- V1__init_schema.sql
-- 1) Create users table + sequence
CREATE TABLE users (
  id            BIGINT PRIMARY KEY,
  provider      VARCHAR(255) NOT NULL,
  provider_id   VARCHAR(255) NOT NULL,
  email         VARCHAR(255),
  display_name  VARCHAR(255),
  picture_url   VARCHAR(255),
  enabled       BOOLEAN NOT NULL
);
CREATE SEQUENCE users_seq START WITH 1 INCREMENT BY 1;
ALTER TABLE users ALTER COLUMN id SET DEFAULT nextval('users_seq');

-- 2) Create roles table
CREATE TABLE roles (
  name VARCHAR(50) PRIMARY KEY
);

-- 3) Join table user_roles
CREATE TABLE user_roles (
  user_id BIGINT   NOT NULL REFERENCES users(id),
  name    VARCHAR(50) NOT NULL REFERENCES roles(name),
  PRIMARY KEY(user_id, name)
);

-- 4) Tokens table + sequence
CREATE TABLE tokens (
  id         BIGINT PRIMARY KEY,
  value      VARCHAR(512) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  revoked    BOOLEAN NOT NULL,
  user_id    BIGINT   NOT NULL REFERENCES users(id)
);
CREATE SEQUENCE tokens_seq START WITH 1 INCREMENT BY 1;
ALTER TABLE tokens ALTER COLUMN id SET DEFAULT nextval('tokens_seq');

-- 5) Seed your roles
INSERT INTO roles (name) VALUES ('SUPER_ADMIN'), ('USER');
