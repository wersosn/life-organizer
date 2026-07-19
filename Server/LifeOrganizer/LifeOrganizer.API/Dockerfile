FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["LifeOrganizer.API/LifeOrganizer.API.csproj", "LifeOrganizer.API/"]
COPY ["LifeOrganizer.Application/LifeOrganizer.Application.csproj", "LifeOrganizer.Application/"]
COPY ["LifeOrganizer.Domain/LifeOrganizer.Domain.csproj", "LifeOrganizer.Domain/"]
COPY ["LifeOrganizer.Infrastructure/LifeOrganizer.Infrastructure.csproj", "LifeOrganizer.Infrastructure/"]

RUN dotnet restore "LifeOrganizer.API/LifeOrganizer.API.csproj"

COPY . .

WORKDIR "/src/LifeOrganizer.API"
RUN dotnet build "LifeOrganizer.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "LifeOrganizer.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app

COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "LifeOrganizer.API.dll"]