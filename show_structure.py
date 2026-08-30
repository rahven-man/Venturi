from pathlib import Path
import sys

# Force UTF-8 output on Windows
sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path.cwd()

# These directories will NOT be shown/expanded
EXCLUDED_DIRS = {
    ".git",
    ".venv",
    "venv",
    "__pycache__",
    "raw",
}


def print_tree(path: Path, prefix=""):
    items = []

    for item in sorted(
        path.iterdir(),
        key=lambda x: (x.is_file(), x.name.lower())
    ):
        # Skip excluded directories
        if item.is_dir() and item.name in EXCLUDED_DIRS:
            continue

        items.append(item)

    for i, item in enumerate(items):
        is_last = i == len(items) - 1

        connector = "└── " if is_last else "├── "

        print(prefix + connector + item.name)

        if item.is_dir():
            extension = "    " if is_last else "│   "
            print_tree(item, prefix + extension)


print(ROOT.name)
print_tree(ROOT)