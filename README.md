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
Jwt__ExpiryMinutes=60
 
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
 
> **Note:** the credentials and connection string in `docker-compose.yml` (`password`, `ConnectionStrings__DefaultConnection`, etc.) are placeholders for local development only — replace them before deploying anywhere public!

### 5. Run the mobile app
```bash
cd Mobile/LifeOrganizerMobile
 
# Install dependencies
npm install
 
# Start the Expo dev server
npx expo start
```
Then scan the QR code with the **Expo Go** app (Android/iOS) or run it on an emulator/simulator. Make sure the app's API base URL (in its config/`.env`) points to your running backend instance.

## Roadmap
### Backend
- [x] Project structure (Clean Architecture)
- [x] User registration & login (JWT)
- [x] Task List module
- [x] Habit Tracker module
- [x] Finance Tracker module
- [x] Chore Tracker module
- [x] Automation engine (habits → tasks)
- [x] Automation engine (chores → tasks)
- [ ] Notifications system
- [ ] Task history + configurable retention/cleanup
- [ ] Background services for scheduled checks
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
- [ ] Push notifications
- [ ] Settings (automation toggle, history retention)
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
- - **Jest** (testy)
> TBA

### DevOps
- **Docker** / Docker Compose
- **GitHub Actions** (CI/CD)

## Architektura
Backend oparty jest na zasadach **Clean Architecture**, z wyraźnym podziałem na:
- `Domain` — encje, reguły biznesowe
- `Application` — przypadki użycia, komendy/zapytania MediatR, interfejsy
- `Infrastructure` — EF Core, PostgreSQL, usługi zewnętrzne
- `API` — kontrolery, middleware, uwierzytelnianie
- `Tests` — testy

## Instrukcja użytkowania
> Ta sekcja to wstępny przewodnik startowy i będzie rozbudowywana wraz z rozwojem projektu!

### Wymagania wstępne
- [.NET 8 SDK](https://dotnet.microsoft.com/download) - wymagane tylko przy uruchamianiu backendu bez Dockera
- [Docker](https://www.docker.com/) - wymagany tylko przy uruchamianiu backendu z Dockerem
- Instancja [PostgreSQL](https://www.postgresql.org/) (lokalna lub hostowana, np. Supabase/Neon/Azure)
- [Node.js](https://nodejs.org/) (LTS) + [Expo CLI](https://docs.expo.dev/get-started/installation/) - do aplikacji mobilnej

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
Jwt__ExpiryMinutes=60
 
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
 
> **Uwaga:** dane logowania i connection string w `docker-compose.yml` (`password`, `ConnectionStrings__DefaultConnection` itd.) to wartości tymczasowe, przeznaczone wyłącznie do developmentu lokalnego — zmień je przed jakimkolwiek publicznym wdrożeniem!
 
### 5. Uruchomienie aplikacji mobilnej
```bash
cd Mobile/LifeOrganizerMobile
 
# Zainstaluj zależności
npm install
 
# Uruchom serwer deweloperski Expo
npx expo start
```
Następnie zeskanuj kod QR aplikacją **Expo Go** (Android/iOS) lub uruchom na emulatorze/symulatorze. Upewnij się, że bazowy URL API w konfiguracji aplikacji (config/`.env`) wskazuje na Twoją uruchomioną instancję backendu.

## Plan prac
### Backend
- [x] Struktura projektu (Clean Architecture)
- [x] Rejestracja i logowanie użytkownika (JWT)
- [x] Moduł listy zadań
- [x] Moduł Habit Tracker
- [x] Moduł Finance Tracker
- [x] Moduł Chore Tracker
- [x] Silnik automatyzacji (nawyki → zadania)
- [x] Silnik automatyzacji (obowiązki → zadania)
- [ ] System powiadomień
- [ ] Historia zadań + konfigurowalny czas przechowywania i czyszczenie
- [ ] Background services do zaplanowanych sprawdzeń
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
- [ ] Powiadomienia push
- [ ] Ustawienia (włącz/wyłącz automatyzację, czas przechowywania historii)
- [ ] Testy API, jednostkowe oraz komponentów
