# Use Python 3.11 (The best version for AI/LangChain)
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file first (makes building faster)
COPY requirements.txt .

# Install the Python tools
RUN pip install --no-cache-dir -r requirements.txt

# Copy all your Python code
COPY . .

# Expose the port FastAPI uses
EXPOSE 8000

# The command to start your FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]