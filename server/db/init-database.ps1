# PostgreSQL connection parameters
$PGUSER = "postgres"
$PGPASSWORD = "postgres"
$PGHOST = "localhost"

# PostgreSQL bin directory - update this path if your PostgreSQL is installed in a different location
$PGBIN = "C:\Program Files\PostgreSQL\17\bin"

Write-Host "Creating database..."
& "$PGBIN\psql.exe" -U $PGUSER -f "create-database.sql"

Write-Host "Initializing schema..."
& "$PGBIN\psql.exe" -U $PGUSER -d drivethru -f "schema.sql"

Write-Host "Inserting seed data..."
& "$PGBIN\psql.exe" -U $PGUSER -d drivethru -f "seed-data.sql"

Write-Host "Database initialization complete!" 