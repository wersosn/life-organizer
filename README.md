Version [ENG](#Life-Organizer-App) | [PL](#Aplikacja-do-organizacji-życia)
# Life Organizer App
> **Status:** Early development stage - actively being built. This README serves as both project documentation and a personal progress tracker.
A mobile life-management app that brings together task management, habit tracking, personal finance tracking, and household chore tracking in one place - with smart automation that turns neglected habits and overdue chores into actionable tasks.

## Table of contents
- [Core idea](#core-idea)
- [Automation system](#automation-system)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Roadmap](#roadmap)

## Core idea
After logging in, the user gets access to four main modules:
- **Task List** - a general to-do list
- **Habit Tracker** - tracking recurring habits
- **Finance Tracker** - personal finance/budget tracking
- **Chore Tracker** - household chores with categories and frequency  
The key feature is an **automation system** that connects these modules together (see below).

## Automation system
- If a **habit** isn't completed within a defined time window, it automatically gets added to the task list as a to-do item.
- Each **chore** has a category, a set frequency, and a "last completed" timestamp. When the chore is overdue, the user receives a notification (e.g. *"You haven't changed your bedsheets in 3 weeks"*) and the chore is added to the task list.
- Automation can be **disabled per user** at any time.
- **Task history** is kept with a user-configurable retention period; entries older than the set threshold are automatically cleaned up.

## Tech stack
### Backend
- **ASP.NET Core Web API**
- **PostgreSQL** (hosted/online database)
- **Entity Framework Core** + **Fluent API** for entity configuration
- **MediatR** (CQRS pattern)
- **JWT** authentication
- **Background Services** (for automation checks, notifications, history cleanup)
- **Serilog** (logs)
- **xUnit** (tests)
> TBA

### Mobile App
- **React Native** with **Expo**
- **SQLite** for local storage (offline mode)
- **Offline-first** sync approach
- **Jest** (tests)
> TBA

### DevOps
- **Docker** / Docker Compose
- **GitHub Actions** (CI/CD)

## Architecture
The backend follows **Clean Architecture** principles, with a clear separation between:
- `Domain` - entities, business rules
- `Application` - use cases, MediatR commands/queries, interfaces
- `Infrastructure` - EF Core, PostgreSQL, external services
- `API` - controllers, middleware, authentication
- `Tests` - tests

## Getting started
> This section is a work-in-progress starter guide and will be expanded as the project grows!

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download) - required only if running the backend without Docker
- [Docker](https://www.docker.com/) - required only if running the backend with Docker
- [PostgreSQL](https://www.postgresql.org/) instance (local or hosted, e.g. Supabase/Neon/Azure)
- [Node.js](https://nodejs.org/) (LTS) + [Expo CLI](https://docs.expo.dev/get-started/installation/) - for the mobile app
- [Expo Go](https://expo.dev/go) app on your phone - for quick local testing without building a native app
- An [Expo account](https://expo.dev/) + [EAS CLI](https://docs.expo.dev/eas/) - only if you want to build a standalone, installable APK

### 1. Clone the repository
```bash
git clone https://github.com/wersosn/life-organizer
cd life-organizer
```
 
### 2. Configure environment variables
Create an `.env` file (or update `appsettings.json` / `appsettings.Development.json` in `LifeOrganizer.API`) with your own values, based on the example below:
```env
# Database
ConnectionStrings__DefaultConnection=Host=localhost;Port=5432;Database=lifeorganizer;Username=postgres;Password=yourpassword
 
# JWT
Jwt__Key=your-super-secret-key-min-32-characters
Jwt__Issuer=LifeOrganizerAPI
Jwt__Audience=LifeOrganizerClient
Jwt__AccessTokenMinutes=20
Jwt__RefreshTokenDays=30
 
# ASP.NET Core
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://+:8080
```
> The double underscore (`__`) syntax lets ASP.NET Core read these as nested configuration keys (e.g. `Jwt__Key` maps to `Jwt:Key`), which works both in `.env`/Docker and in `appsettings.json`.
 
### 3. Run the backend - without Docker
```bash
cd Server/LifeOrganizer/LifeOrganizer.API
 
# Restore dependencies
dotnet restore
 
# Apply EF Core migrations (creates the database schema)
dotnet ef database update
 
# Run the API
dotnet run
```
 
The API should now be available at `http://localhost:5292` and `https://localhost:7292` (or the port set in `launchSettings.json`).
 
### 4. Run the backend - with Docker
The project includes a `docker-compose.yml` that spins up the API together with a PostgreSQL database.
From the root of the repository:
```bash
docker compose up --build
```
 
This will:
- build the API image from `LifeOrganizer.API/Dockerfile`,
- start a `postgres:16` container with the database, user and password defined in `docker-compose.yml`,
- start the API container, connected to Postgres via the internal Docker network (`Host=postgres`).
The API will be available at `http://localhost:8080`, and PostgreSQL at `localhost:5432` (useful if you want to connect with a DB client like DBeaver/pgAdmin).
 
To stop the containers:
```bash
docker compose down
```
 
To also remove the database volume (this deletes all local data!):
```bash
docker compose down -v
```
 
> **Note:** the credentials and connection string in `docker-compose.yml` (`password`, `ConnectionStrings__DefaultConnection`, etc.) are placeholders for local development only!

### 5. Run the mobile app
```bash
cd Mobile/LifeOrganizerMobile
 
# Install dependencies
npm install
```
Create an `.env` file in `Mobile/LifeOrganizerMobile` pointing to your running backend instance:
```env
EXPO_PUBLIC_API_URL=http://192.168.x.x:5292/api
```

> **Use your computer's local network IP, not `localhost`.** Your phone and computer are separate devices on the network -  `localhost` on the phone refers to the phone itself, not your computer. Find your IP with `ipconfig` (Windows) or `ifconfig`/`ip addr` (macOS/Linux), and make sure your phone is connected to the **same Wi-Fi network** as your computer.

> The backend uses plain HTTP for local development. Android blocks cleartext (non-HTTPS) traffic by default in standalone/release builds (though not in Expo Go or development builds) - this is already handled by the `expo-build-properties` plugin in `app.json` (`usesCleartextTraffic: true`). This is fine for local development, but should not be relied on for a production deployment - use HTTPS there instead.

### 6. Run the mobile app - with Expo Go (recommended for day-to-day development)
```
npx expo start
```
Then scan the QR code with the **Expo Go** app (Android/iOS) or run it on an emulator/simulator. Make sure the app's API base URL (in its config/`.env`) points to your running backend instance.

This gives you instant hot reload for any JS/TS changes - no build step needed. Note that a few native features (e.g. push notifications on Android) are [not supported in Expo Go](https://docs.expo.dev/push-notifications/what-you-need-to-know/) and require a development or standalone build instead.

### 7. Build a standalone, installable APK - with EAS Build
Useful when you want to install the app directly on a device without a computer/Expo Go running (e.g. to test native-only features, or to share a build for testing).

```bash
npm install -g eas-cli
eas login
eas build:configure
```

The project's `eas.json` should have a `preview` profile configured to output an installable `.apk` (instead of the Play Store `.aab` format):
```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "env": {
        "EXPO_PUBLIC_API_URL": "http://192.168.x.x:5292/api"
      }
    }
  }
}
```

> **Environment variables are not read from your local `.env` file during a cloud build** - EAS Build runs on a remote machine that only has access to whatever is committed to the repository. Set `EXPO_PUBLIC_API_URL` (and any other `EXPO_PUBLIC_*` variables) either directly in `eas.json` as above, or via `eas env:set --scope project --name EXPO_PUBLIC_API_URL --value "..." --environment preview` (choose **Plain text** visibility for non-sensitive values like a local API URL).

Then build:
```bash
eas build --platform android --profile preview
```

The first build will ask to generate a new Android Keystore - accept this unless you already have one for the project (EAS stores and manages it securely on your behalf). The build runs entirely in the cloud (10-20 minutes, plus queue time on the free tier); once finished, download and install the `.apk` either via the printed link/QR code, or from the **Builds** tab on [expo.dev](https://expo.dev).

> Any native-level change (new native dependency, a plugin added to `app.json`, permissions, etc.) requires a new build to take effect. Pure JS/TS changes don't - for those, prefer Expo Go (step 6) during development, or look into [EAS Update](https://docs.expo.dev/eas-update/introduction/) for pushing JS-only updates to an already-installed build without a full rebuild.

## Roadmap
### Backend
- [x] Project structure (Clean Architecture)
- [x] User registration & login (JWT)
- [x] E-mail confirmation & password reset (JWT)
- [x] Task List module
- [x] Habit Tracker module
- [x] Finance Tracker module
- [x] Chore Tracker module
- [x] Automation engine (habits → tasks)
- [x] Automation engine (chores → tasks)
- [x] Notifications system
- [x] Task history + configurable retention/cleanup
- [ ] Background services for scheduled checks
- [x] Data export (csv, json)
- [ ] Unit & integration tests
- [x] API documentation (Swagger/OpenAPI)

### Mobile App
- [x] Auth screens (register/login)
- [x] Navigation & tab structure (4 modules)
- [x] Task List screen
- [x] Habit Tracker screen
- [x] Finance Tracker screen
- [x] Chore Tracker screen
- [x] Automation
- [ ] Offline mode with SQLite
- [ ] Sync mechanism (local ↔ server)
- [x] Push notifications
- [x] Statistics
- [x] Settings (automation toggle, history retention)
- [ ] API, unit & components tests

# Aplikacja do organizacji życia
> **Status:** Wczesna faza rozwoju - projekt jest aktywnie rozwijany. Ten README pełni jednocześnie rolę dokumentacji projektu i osobistej listy postępu prac.
Projekt jest aplikacją mobilną do zarządzania życiem codziennym, łącząca w sobie listę zadań, śledzenie nawyków, finansów oraz obowiązków domowych - wraz z inteligentnym systemem automatyzacji, który zamienia zaniedbane nawyki i zaległe obowiązki w konkretne zadania do wykonania.

## Spis treści
- [Główna idea](#główna-idea)
- [System automatyzacji](#system-automatyzacji)
- [Technologie](#technologie)
- [Architektura](#architektura)
- [Instrukcja użytkowania](#instrukcja-użytkowania)
- [Plan prac](#plan-prac)

## Główna idea
Po zalogowaniu użytkownik ma dostęp do czterech głównych zakładek:
- **Lista zadań** - ogólna lista rzeczy do zrobienia
- **Habit Tracker** - śledzenie powtarzalnych nawyków
- **Finance Tracker** - śledzenie finansów osobistych/budżetu
- **Chore Tracker** - obowiązki domowe z kategoriami i częstotliwością  
Kluczową funkcją jest **system automatyzacji**, który łączy te moduły ze sobą (opis poniżej).

## System automatyzacji
- Jeśli **nawyk** nie zostanie wykonany w ustalonym czasie, automatycznie zostaje dodany do listy zadań jako task do wykonania.
- Każdy **obowiązek domowy** ma kategorię, ustaloną częstotliwość oraz datę ostatniego wykonania. Gdy termin mija, użytkownik otrzymuje powiadomienie (np. *"Nie zmieniałeś/aś pościeli od 3 tygodni"*), a obowiązek trafia na listę zadań.
- Automatyzację można **wyłączyć** w dowolnym momencie na poziomie ustawień użytkownika.
- **Historia zadań** posiada konfigurowalny przez użytkownika czas przechowywania wpisów; starsze wpisy są automatycznie usuwane po przekroczeniu ustalonego progu.

## Technologie
### Backend
- **ASP.NET Core Web API**
- **PostgreSQL** (baza danych online)
- **Entity Framework Core** + **Fluent API** do konfiguracji encji
- **MediatR** (wzorzec CQRS)
- **JWT** do uwierzytelniania
- **Background Services** (do sprawdzania automatyzacji, powiadomień, czyszczenia historii)
- **Serilog** (logi)
- **xUnit** (testy)
> TBA

### Mobile App
- **React Native** z **Expo**
- **SQLite** do przechowywania danych lokalnych (tryb offline)
- Podejście **offline-first** z synchronizacją
- **Jest** (testy)
> TBA

### DevOps
- **Docker** / Docker Compose
- **GitHub Actions** (CI/CD)

## Architektura
Backend oparty jest na zasadach **Clean Architecture**, z wyraźnym podziałem na:
- `Domain` - encje, reguły biznesowe
- `Application` - przypadki użycia, komendy/zapytania MediatR, interfejsy
- `Infrastructure` - EF Core, PostgreSQL, usługi zewnętrzne
- `API` - kontrolery, middleware, uwierzytelnianie
- `Tests` - testy

## Instrukcja użytkowania
> Ta sekcja to wstępny przewodnik startowy i będzie rozbudowywana wraz z rozwojem projektu!

### Wymagania wstępne
- [.NET 8 SDK](https://dotnet.microsoft.com/download) - wymagane tylko przy uruchamianiu backendu bez Dockera
- [Docker](https://www.docker.com/) - wymagany tylko przy uruchamianiu backendu z Dockerem
- Instancja [PostgreSQL](https://www.postgresql.org/) (lokalna lub hostowana, np. Supabase/Neon/Azure)
- [Node.js](https://nodejs.org/) (LTS) + [Expo CLI](https://docs.expo.dev/get-started/installation/) - do aplikacji mobilnej
- Aplikacja [Expo Go](https://expo.dev/go) na telefonie - do szybkiego testowania lokalnego bez budowania aplikacji natywnej
- Konto [Expo](https://expo.dev/) + [EAS CLI](https://docs.expo.dev/eas/) - tylko jeśli chcesz zbudować samodzielny, instalowalny plik APK

### 1. Sklonuj repozytorium
```bash
git clone https://github.com/wersosn/life-organizer
cd life-organizer
```
 
### 2. Skonfiguruj zmienne środowiskowe
Utwórz plik `.env` (lub uzupełnij `appsettings.json` / `appsettings.Development.json` w `LifeOrganizer.API`) własnymi wartościami, na wzór przykładu poniżej:
```env
# Baza danych
ConnectionStrings__DefaultConnection=Host=localhost;Port=5432;Database=lifeorganizer;Username=postgres;Password=yourpassword
 
# JWT
Jwt__Key=your-super-secret-key-min-32-characters
Jwt__Issuer=LifeOrganizerAPI
Jwt__Audience=LifeOrganizerClient
Jwt__AccessTokenMinutes=20
Jwt__RefreshTokenDays=30
 
# ASP.NET Core
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://+:8080
```
> Podwójny podkreślnik (`__`) pozwala ASP.NET Core odczytać te wartości jako zagnieżdżone klucze konfiguracji (np. `Jwt__Key` odpowiada `Jwt:Key`), co działa zarówno w `.env`/Dockerze, jak i w `appsettings.json`.
 
### 3. Uruchomienie backendu - bez Dockera
```bash
cd Server/LifeOrganizer/LifeOrganizer.API
 
# Przywróć zależności
dotnet restore
 
# Zastosuj migracje EF Core (tworzy schemat bazy danych)
dotnet ef database update
 
# Uruchom API
dotnet run
```
API powinno być dostępne pod adresem `http://localhost:5292` i `https://localhost:7292` (lub na porcie ustawionym w `launchSettings.json`)).
 
### 4. Uruchomienie backendu - z Dockerem
Projekt zawiera plik `docker-compose.yml`, który uruchamia API razem z bazą danych PostgreSQL.
Z poziomu głównego folderu repozytorium:
```bash
docker compose up --build
```
 
Spowoduje to:
- zbudowanie obrazu API na podstawie `LifeOrganizer.API/Dockerfile`,
- uruchomienie kontenera `postgres:16` z bazą danych, użytkownikiem i hasłem zdefiniowanymi w `docker-compose.yml`,
- uruchomienie kontenera API, połączonego z Postgresem poprzez wewnętrzną sieć Dockera (`Host=postgres`).
API będzie dostępne pod adresem `http://localhost:8080`, a PostgreSQL pod `localhost:5432` (przydatne, jeśli chcesz połączyć się klientem bazodanowym, np. DBeaver/pgAdmin).
 
Aby zatrzymać kontenery:
```bash
docker compose down
```
 
Aby dodatkowo usunąć wolumen z danymi bazy (usuwa to wszystkie lokalne dane!):
```bash
docker compose down -v
```
 
> **Uwaga:** dane logowania i connection string w `docker-compose.yml` (`password`, `ConnectionStrings__DefaultConnection` itd.) to wartości tymczasowe, przeznaczone wyłącznie do developmentu lokalnego!
 
### 5. Uruchomienie aplikacji mobilnej
```bash
cd Mobile/LifeOrganizerMobile
 
# Zainstaluj zależności
npm install
```

Utwórz plik `.env` w `Mobile/LifeOrganizerMobile`, wskazujący na Twoją uruchomioną instancję backendu:
```env
EXPO_PUBLIC_API_URL=http://192.168.x.x:5292/api
```

> **Użyj lokalnego adresu IP komputera w sieci, nie `localhost`.** Telefon i komputer to osobne urządzenia w sieci - `localhost` na telefonie odnosi się do samego telefonu, nie do komputera. Adres IP znajdziesz przez `ipconfig` (Windows) lub `ifconfig`/`ip addr` (macOS/Linux). Upewnij się też, że telefon jest podłączony do **tej samej sieci Wi-Fi** co komputer.

> Backend w wersji lokalnej używa zwykłego HTTP. Android domyślnie blokuje ruch cleartext (nieszyfrowany, nie HTTPS) w samodzielnych/wydaniowych buildach (nie dotyczy to jednak Expo Go ani development buildów) - jest to już obsłużone przez plugin `expo-build-properties` w `app.json` (`usesCleartextTraffic: true`). Jest to rozwiązanie odpowiednie do developmentu lokalnego, ale nie powinno być stosowane w wdrożeniu produkcyjnym - tam należy używać HTTPS.

### 6. Uruchomienie aplikacji mobilnej - przez Expo Go (zalecane do codziennej pracy)
```bash
npx expo start
```
Następnie zeskanuj kod QR aplikacją **Expo Go** (Android/iOS) lub uruchom na emulatorze/symulatorze.

Dzięki temu zmiany w kodzie JS/TS pojawiają się natychmiast (hot reload) - bez potrzeby budowania aplikacji. Warto pamiętać, że część funkcji natywnych (np. powiadomienia push na Androidzie) [nie jest wspierana w Expo Go](https://docs.expo.dev/push-notifications/what-you-need-to-know/) i wymaga development buildu lub samodzielnego builda.

### 7. Zbudowanie samodzielnego, instalowalnego pliku APK - przez EAS Build
Przydatne, gdy chcesz zainstalować aplikację bezpośrednio na urządzeniu bez podłączonego komputera/Expo Go (np. do testowania funkcji dostępnych tylko natywnie, albo żeby udostępnić build komuś innemu do testów).

```bash
npm install -g eas-cli
eas login
eas build:configure
```

Profil `preview` w pliku `eas.json` projektu powinien być skonfigurowany tak, aby generował instalowalny plik `.apk` (zamiast formatu `.aab` przeznaczonego na Google Play):
```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "env": {
        "EXPO_PUBLIC_API_URL": "http://192.168.x.x:5292/api"
      }
    }
  }
}
```

> **Zmienne środowiskowe nie są odczytywane z lokalnego pliku `.env` podczas builda w chmurze** - EAS Build działa na zdalnej maszynie, która ma dostęp wyłącznie do tego, co zostało zacommitowane do repozytorium. Ustaw `EXPO_PUBLIC_API_URL` (i inne zmienne `EXPO_PUBLIC_*`) bezpośrednio w `eas.json` jak wyżej, albo przez `eas env:set --scope project --name EXPO_PUBLIC_API_URL --value "..." --environment preview` (dla wartości nie-wrażliwych, jak lokalny adres API, wybierz widoczność **Plain text**).

Następnie uruchom build:
```bash
eas build --platform android --profile preview
```

Pierwszy build zapyta o wygenerowanie nowego Android Keystore - zaakceptuj to, chyba że masz już jeden przypisany do tego projektu (EAS bezpiecznie przechowuje go i zarządza nim za Ciebie). Build wykonuje się w całości w chmurze (10-20 minut, plus czas oczekiwania w kolejce na darmowym planie); po zakończeniu pobierz i zainstaluj plik `.apk` poprzez wypisany link/kod QR, albo z zakładki **Builds** na [expo.dev](https://expo.dev).

> Każda zmiana na poziomie natywnym (nowa zależność natywna, plugin dodany w `app.json`, uprawnienia itd.) wymaga nowego builda, żeby zaczęła obowiązywać. Zmiany czysto w JS/TS - nie wymagają; do nich lepiej korzystać z Expo Go (krok 6) podczas developmentu, albo rozważyć [EAS Update](https://docs.expo.dev/eas-update/introduction/), żeby wypuszczać aktualizacje JS do już zainstalowanego builda bez pełnego rebuilda.

> **Uwaga przy konfigurowaniu EAS Update:** komenda `eas update:configure` modyfikuje lokalnie pliki `app.json`/`eas.json` (dodaje m.in. pole `runtimeVersion`). Pamiętaj, żeby zacommitować te zmiany (`git add app.json eas.json && git commit`) przed uruchomieniem kolejnego builda - EAS pakuje projekt na podstawie stanu zacommitowanego w repozytorium, więc niezacommitowane zmiany w `app.json` mogą spowodować błąd `Runtime version mismatch` przy buildzie.

## Plan prac
### Backend
- [x] Struktura projektu (Clean Architecture)
- [x] Rejestracja i logowanie użytkownika (JWT)
- [x] Potwierdzanie adresu e-mail oraz reset hasła (JWT)
- [x] Moduł listy zadań
- [x] Moduł Habit Tracker
- [x] Moduł Finance Tracker
- [x] Moduł Chore Tracker
- [x] Silnik automatyzacji (nawyki → zadania)
- [x] Silnik automatyzacji (obowiązki → zadania)
- [x] System powiadomień
- [x] Historia zadań + konfigurowalny czas przechowywania i czyszczenie
- [ ] Background services do zaplanowanych sprawdzeń
- [x] Eksport danych (csv, json)
- [ ] Testy jednostkowe i integracyjne
- [x] Dokumentacja API (Swagger/OpenAPI)

### Aplikacja mobilna
- [x] Ekrany logowania/rejestracji
- [x] Nawigacja i struktura zakładek (4 moduły)
- [x] Ekran listy zadań
- [x] Ekran Habit Tracker
- [x] Ekran Finance Tracker
- [x] Ekran Chore Tracker
- [x] Automatyzacja
- [ ] Tryb offline z SQLite
- [ ] Mechanizm synchronizacji (lokalnie ↔ serwer)
- [x] Powiadomienia push
- [x] Statystyki
- [x] Ustawienia (włącz/wyłącz automatyzację, czas przechowywania historii)
- [ ] Testy API, jednostkowe oraz komponentów
