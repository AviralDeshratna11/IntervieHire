"""Default exit-interview question spine.

Seeded into a Job's ``functional_parameters`` when a ``job_kind == "exit"`` job is
created without an authored blueprint, so an exit interview has questions to ask
out of the box. It uses the SAME shape as a hiring functional blueprint
(``topics`` -> ``questionsDetailed``), so it flows through the existing sync
(``ai_sync.py``) into the engine's ``Question`` rows unchanged. The topic name
becomes the engine ``topicCategories`` -> the theme label shown in the verbatim
HR view.

Fixed spine only. Live LLM follow-up probing (the engine's ``decideNextTurn``
director) layers on top at run time when a ``DEEPSEEK_API_KEY`` is present,
without changing these questions. Exit answers are recorded, not scored, so each
question's guidance is marked ``scoring: none`` and carries no rubric.
"""
import json

# (theme, [questions], mandatory). Questions apply the exit-interview craft rules:
# open, neutral, non-leading, forward-framed. Kept fixed so every leaver is asked
# the same spine (which is what makes the answers aggregatable for trends later).
_EXIT_THEMES = [
    ("Reason for leaving", [
        "What ultimately made you decide to leave?",
        "When did you first start thinking about leaving, and what was going on then?",
    ], False),
    ("Role & day-to-day", [
        "What did you find most energizing about your work here?",
        "What did you find most draining or frustrating?",
    ], False),
    ("Management", [
        "How would you describe your working relationship with your manager?",
    ], False),
    ("Growth", [
        "What did growth and progression look like for you here?",
    ], False),
    ("Compensation", [
        "How well did your compensation reflect the scope of what you were responsible for?",
    ], False),
    ("Team & culture", [
        "How would you describe the team you worked with day to day?",
        "How much did you feel you belonged and could be yourself at work?",
    ], False),
    ("Workload & wellbeing", [
        "What was your workload and pace actually like, week to week?",
    ], False),
    ("The new opportunity", [
        "What does your new role offer that this one didn't?",
    ], False),
    ("Recommendation", [
        "Under what circumstances, if any, would you consider coming back?",
        "If a friend were considering a job here, what would you honestly tell them?",
    ], False),
    ("Advice to leadership", [
        "If you were advising leadership, what one change would most improve retention?",
    ], False),
    ("Open disclosure", [
        "Before we finish — is there anything else you'd want us to know, including any concerns about conduct, safety, or fairness?",
    ], True),
]


def _build_default_exit_blueprint() -> dict:
    topics = []
    for t_index, (theme, questions, mandatory) in enumerate(_EXIT_THEMES, start=1):
        detailed = []
        for q_index, text in enumerate(questions, start=1):
            detailed.append({
                "id": f"exit-{t_index:02d}-{q_index}",
                "text": text,
                "difficulty": "EASY",
                "estimatedMinutes": 3,
                # No rubric / model answer: exit answers are recorded, not graded.
                # questionType + theme still travel so the engine and the report
                # can label the answer by its theme.
                "aiEvaluationGuidance": json.dumps({
                    "questionType": "exit_theme",
                    "theme": theme,
                    "mandatory": mandatory,
                    "scoring": "none",
                }),
            })
        topics.append({
            "name": theme,
            "type": "Experiential",
            "difficulty": "Easy",
            "questions": list(questions),
            "questionsDetailed": detailed,
        })
    return {"topics": topics, "meta": {"template": "default_exit_v1", "scoring": "none"}}


# Built once at import; treated as read-only. Callers that persist it should deep-copy
# or json.dumps it rather than mutating this shared dict.
DEFAULT_EXIT_BLUEPRINT = _build_default_exit_blueprint()
