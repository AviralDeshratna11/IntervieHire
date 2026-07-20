"""Custom application questions — the extra questions a client asks a candidate
(beyond the resume) on the public apply form.

Model:
  • Company default  → Organisation.application_questions  (JSON text)
  • Per-job override → Job.application_questions           (JSON text, wins if set)
  • Candidate answers → Applicant.application_answers       (JSON text)

A question definition is a dict:
    { "id": str, "label": str,
      "type": short_text|long_text|boolean|select|multi_select|number|date|file,
      "required": bool, "options": [str]  # options only for select / multi_select }

Everything is stored as JSON *text* (matching the repo's other JSON blobs like
`screening_questions` / `*_parameters`), so authoring endpoints json.dumps the
normalized list and readers json.loads it back.
"""
import json
import re
from typing import Any, Dict, List, Optional, Tuple

ALLOWED_TYPES = (
    "short_text", "long_text", "boolean", "select",
    "multi_select", "number", "date", "file",
)
# Types whose definition carries a candidate-facing list of `options`.
OPTION_TYPES = ("select", "multi_select")


def _slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", (text or "").strip().lower()).strip("-")


def normalize_questions(raw: Any) -> List[Dict[str, Any]]:
    """Coerce arbitrary authoring input into a clean, validated question list.

    Drops entries with no label, forces a known type (defaulting to short_text),
    assigns a stable unique id per question (slug of the label, else q1/q2…), and
    keeps non-empty string `options` only for `select`. Safe on any input.
    """
    if isinstance(raw, str):
        try:
            raw = json.loads(raw)
        except Exception:
            return []
    if not isinstance(raw, list):
        return []

    out: List[Dict[str, Any]] = []
    seen: set = set()
    for i, item in enumerate(raw):
        if not isinstance(item, dict):
            continue
        label = str(item.get("label") or item.get("question") or "").strip()
        if not label:
            continue
        qtype = str(item.get("type") or "short_text").strip().lower()
        if qtype not in ALLOWED_TYPES:
            qtype = "short_text"

        qid = str(item.get("id") or "").strip() or _slug(label) or f"q{i + 1}"
        base, n = qid, 2
        while qid in seen:
            qid = f"{base}-{n}"
            n += 1
        seen.add(qid)

        q: Dict[str, Any] = {
            "id": qid,
            "label": label,
            "type": qtype,
            "required": bool(item.get("required", False)),
        }
        if qtype in OPTION_TYPES:
            opts = item.get("options")
            q["options"] = [str(o).strip() for o in opts if str(o).strip()] if isinstance(opts, list) else []
        out.append(q)
    return out


def resolve_questions(job: Any, org: Any) -> List[Dict[str, Any]]:
    """Effective question set for a job: the per-job override if present, else the
    company default, else []. Returns normalized definitions."""
    raw: Optional[str] = None
    if job is not None and getattr(job, "application_questions", None):
        raw = job.application_questions
    elif org is not None and getattr(org, "application_questions", None):
        raw = org.application_questions
    if not raw:
        return []
    return normalize_questions(raw)


def collect_answers(values: Dict[str, Any], questions: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[str]]:
    """Pull candidate answers out of a submitted form.

    `values` maps form field names → submitted values; each question is read from
    field `aq__<id>`. Returns (answers, missing_required_labels). Each stored
    answer snapshots the question label + type so it still renders correctly even
    if the recruiter later edits the questions.

    Type handling:
      • multi_select → all checked options (`getlist` when the form supports it),
        stored as a comma-joined string;
      • file → the uploaded file's original name (the bytes are saved separately by
        the caller, which then enriches the answer with a `url`);
      • boolean → normalized to "Yes"/"No"; number/date/short/long → trimmed text.
    """
    answers: List[Dict[str, Any]] = []
    missing: List[str] = []
    has_getlist = hasattr(values, "getlist")
    for q in questions:
        qid = q.get("id")
        name = f"aq__{qid}"
        qtype = q.get("type") or "short_text"

        if qtype == "multi_select":
            raws = values.getlist(name) if has_getlist else ([values.get(name)] if values.get(name) is not None else [])
            picked = [str(v).strip() for v in raws if str(v).strip()]
            val = ", ".join(picked)
        elif qtype == "file":
            raw = values.get(name)
            val = (getattr(raw, "filename", "") or "").strip()
        else:
            raw = values.get(name)
            val = ("" if raw is None else str(raw)).strip()
            if qtype == "boolean":
                val = "Yes" if val.lower() in ("yes", "true", "on", "1") else ("No" if val else "")

        if q.get("required") and not val:
            missing.append(q.get("label") or str(qid))
            continue
        if val:
            answers.append({
                "id": qid,
                "question": q.get("label"),
                "type": qtype,
                "answer": val,
            })
    return answers, missing


def parse_answers(raw: Optional[str]) -> List[Dict[str, Any]]:
    """json.loads stored applicant answers, tolerant of nulls/garbage."""
    if not raw:
        return []
    try:
        data = json.loads(raw)
    except Exception:
        return []
    return data if isinstance(data, list) else []
