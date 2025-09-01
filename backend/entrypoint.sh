#!/bin/sh
# entrypoint.sh

until pg_isready -h db -p 5432; do
  sleep 1
done


alembic upgrade head

daphne -b 0.0.0.0 -p 8000 app.main:app
