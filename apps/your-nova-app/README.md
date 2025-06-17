# your_nova_app

This template contains a simple python app served by [fastapi](https://github.com/tiangolo/fastapi).
It shows you how to use the [NOVA Python SDK](https://github.com/wandelbotsgmbh/wandelbots-nova) and build a basic app with it.

Use the following steps for development:

* make sure you have `uv` installed
    * you can follow these steps https://docs.astral.sh/uv/getting-started/installation/
* ensure proper environment variables are set in `.env`
    * note: you might need to set/update `NOVA_ACCESS_TOKEN` and `NOVA_API`
* use `uv run python -m your_nova_app` to run the the server
    * access the example on `http://localhost:3000`
* build, push and install the app with `nova app install`

## formatting

```bash
$ ruff format
$ ruff check --select I --fix
```