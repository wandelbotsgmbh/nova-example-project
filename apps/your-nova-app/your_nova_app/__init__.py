import uvicorn
from loguru import logger
import os

from your_nova_app.app import app


def main(host: str = "0.0.0.0", port: int = 3000):
    log_level = os.getenv('LOG_LEVEL', 'info')
    logger.info("Starting Service...")

    # base path is injected/set when running within the wandelbots environment
    base_path = os.getenv('BASE_PATH', '')
    if len(base_path) > 0:
        logger.info("serving with base path '{}'", base_path)
    uvicorn.run(app, host=host, port=port, reload=False, log_level=log_level, proxy_headers=True, forwarded_allow_ips='*')
