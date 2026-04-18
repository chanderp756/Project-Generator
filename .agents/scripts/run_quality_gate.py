import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "config.json"


def load_config():
    with open(CONFIG_PATH, "r", encoding="utf-8") as handle:
        return json.load(handle)


def run_command(command: str, cwd: Path | None = None):
    print(f"Running: {command}")
    result = subprocess.run(command, shell=True, cwd=cwd or ROOT)
    if result.returncode != 0:
        raise SystemExit(result.returncode)


def main():
    config = load_config()
    scripts = config.get("quality_gate", {}).get("scripts", {})

    if len(sys.argv) > 1 and sys.argv[1] == "--list":
        print("Available quality gate commands:")
        for key in scripts:
            print(f"  {key}: {scripts[key]}")
        return

    if len(sys.argv) > 1 and sys.argv[1] != "--run":
        print("Usage: python run_quality_gate.py --run")
        return

    print("Starting quality gate run...")
    run_command(scripts["backend_install"], cwd=ROOT)
    run_command(scripts["backend_lint"], cwd=ROOT)
    run_command(scripts["backend_format_check"], cwd=ROOT)
    run_command(scripts["backend_type_check"], cwd=ROOT)
    run_command(scripts["frontend_install"], cwd=ROOT)
    run_command(scripts["frontend_type_check"], cwd=ROOT)
    run_command(scripts["frontend_lint"], cwd=ROOT)
    print("Quality gate complete.")


if __name__ == "__main__":
    main()
