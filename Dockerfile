FROM python:3.12-slim
WORKDIR /app
COPY api/pyproject.toml api/uv.lock ./api/
RUN pip install --no-cache-dir uv && cd api && uv sync --frozen --no-dev
COPY api ./api
COPY data ./data
EXPOSE 8000
CMD ["api/.venv/bin/uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
