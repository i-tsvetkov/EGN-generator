require "http/server"

HTTP::Server.new("127.0.0.1", 8080, [
  HTTP::ErrorHandler.new,
  HTTP::LogHandler.new,
  HTTP::StaticFileHandler.new(".")
]).listen

