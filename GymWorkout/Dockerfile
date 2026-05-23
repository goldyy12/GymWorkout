# 1. Update the runtime to 10.0
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

# 2. Update the SDK builder to 10.0
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Look inside the GymWorkout folder to find the csproj file
COPY ["GymWorkout/GymWorkout.csproj", "GymWorkout/"]
RUN dotnet restore "GymWorkout/GymWorkout.csproj"

# Copy the rest of the application files over
COPY . .

# Step inside the project folder before running the publish command
WORKDIR "/src/GymWorkout"
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "GymWorkout.dll"]