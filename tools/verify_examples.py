from pathlib import Path
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
fixtures = ROOT / "docs" / "examples" / "fixtures"

def fail(message):
    print(message)
    sys.exit(1)

def load(name):
    path = fixtures / name
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"{path}: invalid JSON: {exc}")

context = load("agent-context.json")
plan = load("verification-plan.json")
result = load("agent-result.json")

required_context = ["version", "mission", "boundary", "allowed_changes", "contracts", "acceptance", "verification", "authority"]
for key in required_context:
    if key not in context:
        fail(f"agent-context.json: missing {key}")

for key in ["version", "target", "checks", "acceptance_evidence"]:
    if key not in plan:
        fail(f"verification-plan.json: missing {key}")

for key in ["version", "status", "summary", "changed_files", "verification"]:
    if key not in result:
        fail(f"agent-result.json: missing {key}")

if context["boundary"] != plan["target"]:
    fail("verification-plan target must match agent-context boundary")

if result["status"] not in {"proposed", "completed", "blocked", "failed"}:
    fail("agent-result status is invalid")

for check in plan["checks"]:
    for key in ("id", "type", "command", "purpose"):
        if key not in check:
            fail(f"verification check missing {key}")
    if check["type"] not in {"schema", "contract", "unit", "integration", "static", "policy", "manual"}:
        fail(f"invalid verification type: {check['type']}")

if not result["verification"]:
    fail("agent-result must include verification evidence")

print("BOUND executable example verification: PASS")
