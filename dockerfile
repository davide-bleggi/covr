# Use Node Windows Nanoserver base image
FROM mcr.microsoft.com/windows/servercore:ltsc2022

# Download and install Node.js
RUN powershell -Command \
    Invoke-WebRequest -OutFile nodejs.zip https://nodejs.org/dist/v20.0.0/node-v20.0.0-win-x64.zip; \
    Expand-Archive nodejs.zip -DestinationPath C:\; \
    Rename-Item "C:\node-v20.0.0-win-x64" C:\nodejs; \
    Remove-Item nodejs.zip

# Set environment variables
RUN setx /M PATH "%PATH%;C:\nodejs"

# Verify installation
RUN node --version && npm --version

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

RUN npx prisma generate

ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS="--max-old-space-size=8192"
RUN node -e "console.log(v8.getHeapStatistics().heap_size_limit / 1024 / 1024 + ' MB')"


RUN npm run build

# Expose the port
EXPOSE 4173

# Start the app
SHELL ["cmd", "/S", "/C"]
CMD ["C:\\nodejs\\npm.cmd", "run", "preview", "--", "--host", "0.0.0.0"]
