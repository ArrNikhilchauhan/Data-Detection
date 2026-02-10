FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=10000

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    gfortran \
    libopenblas-dev \
    liblapack-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip wheel setuptools && \
    pip install --no-cache-dir --prefer-binary -r requirements.txt

# Copy app code
COPY app ./app

# Expose port
EXPOSE $PORT

# Start command
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port $PORT"]
