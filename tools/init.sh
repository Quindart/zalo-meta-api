echo "Installing dependencies..."
npm install chalk@^4.1.2 cors@^2.8.5 dotenv@^16.4.7 express@^4.21.2 helmet@^8.0.0 mongoose@^8.9.4 morgan@^1.10.0 nodemon@^3.1.9
if [ $? -eq 0 ]; then
  echo "Dependencies installed successfully."
else
  echo "An error occurred while installing dependencies."
  exit 1
fi
