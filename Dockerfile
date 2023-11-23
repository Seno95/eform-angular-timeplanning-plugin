FROM node:18 as node-env
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY eform-angular-frontend/eform-client ./
RUN yarn install
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
WORKDIR /app
ARG GITVERSION
ARG PLUGINVERSION

# Copy csproj and restore as distinct layers
COPY eform-angular-frontend/eFormAPI/eFormAPI.Web ./eFormAPI.Web
COPY eform-angular-timeplanning-plugin/eFormAPI/Plugins/TimePlanning.Pn ./TimePlanning.Pn
RUN dotnet publish eFormAPI.Web -o eFormAPI.Web/out /p:Version=$GITVERSION --runtime linux-x64 --configuration Release
RUN dotnet publish TimePlanning.Pn -o TimePlanning.Pn/out /p:Version=$PLUGINVERSION --runtime linux-x64 --configuration Release

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build-env /app/eFormAPI.Web/out .
RUN mkdir -p ./Plugins/TimePlanning.Pn
COPY --from=build-env /app/TimePlanning.Pn/out ./Plugins/TimePlanning.Pn
COPY --from=node-env /app/dist wwwroot

ENV DEBIAN_FRONTEND noninteractive
ENV Logging__Console__FormatterName=

ENTRYPOINT ["dotnet", "eFormAPI.Web.dll"]
