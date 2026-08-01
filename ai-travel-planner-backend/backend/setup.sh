#!/usr/bin/env bash
# Convenience setup script — run from inside backend/
# Usage: bash setup.sh
set -e

echo "Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

if [ ! -f .env ]; then
  echo "Creating .env from .env.example — remember to add your GEMINI_API_KEY"
  cp .env.example .env
fi

echo "Running migrations..."
python manage.py migrate

echo "Seeding starter destinations..."
python manage.py seed_destinations

echo ""
echo "Setup complete. Next steps:"
echo "  1. Edit .env and add your GEMINI_API_KEY"
echo "  2. python manage.py createsuperuser   (for /admin/ access)"
echo "  3. python manage.py runserver"
