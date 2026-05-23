FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src


COPY ["GymWorkout/GymWorkout.csproj", "GymWorkout/"]
RUN dotnet restore "GymWorkout/GymWorkout.csproj"


COPY GymWorkout/ GymWorkout/


WORKDIR "/src/GymWorkout"
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "GymWorkout.dll"]