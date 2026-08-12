FROM mcr.microsoft.com/dotnet/sdk:10.0 AS development
WORKDIR /src
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY LocalMindAI.Api.csproj ./
RUN dotnet restore ./LocalMindAI.Api.csproj
COPY . ./
RUN dotnet publish ./LocalMindAI.Api.csproj --configuration Release --output /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
RUN apt-get update \
    && apt-get install --yes --no-install-recommends wget \
    && rm -rf /var/lib/apt/lists/*
ENV ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_URLS=http://+:8080 \
    DOTNET_EnableDiagnostics=0
COPY --from=build /app/publish ./
EXPOSE 8080
ENTRYPOINT ["dotnet", "LocalMindAI.Api.dll"]
