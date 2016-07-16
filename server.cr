require "http/server"

HTTP::Server.new("0.0.0.0", 4444, [
  HTTP::ErrorHandler.new,
  HTTP::LogHandler.new,
  HTTP::StaticFileHandler.new(".")
]).listen

