# Interview Evaluation Foundation

This module is the first version of the transcript-only response evaluation and
reporting layer. It is intentionally flow-agnostic so it can be wired into the
interview system after predetermined questions and generated follow-ups are
implemented.

## Core Method

Each answer is evaluated in one of three modes:

- `model_answer_based`: predetermined question with a model answer or model
  answer rubric.
- `rubric_only`: predetermined question without a model answer.
- `followup_contextual`: generated follow-up answer evaluated with the original
  question and previous answer as context.

The model answer is used as a concept map, not as the only valid answer. A
candidate can receive credit for equivalent correct ideas, valid alternative
solutions, and strong points that go beyond the model answer.

## Data Flow

1. Company presets the interview type.
2. Predetermined questions are asked.
3. Candidate transcript is stored.
4. A generated follow-up is asked based on the previous response.
5. Follow-up transcript is stored with links to the original question and answer.
6. Each response receives a structured `ResponseEvaluation`.
7. All response evaluations are aggregated into a `CandidateReport`.

## Future-Proofing

The current source of truth is transcript analysis. The schema reserves optional
placeholders for future audio and video analysis, but those signals are not part
of the score yet.

Recommended future relationship for follow-ups:

```json
{
  "originalQuestionId": "q1",
  "originalAnswerId": "a1",
  "followupQuestionId": "fq1",
  "followupAnswerId": "fa1"
}
```

## Suggested Integration Points

- Use `buildRubricExtractionPrompt` once when a model answer is created or
  updated.
- Save the extracted `modelAnswerRubric` beside the question.
- Use `buildAnswerEvaluationPrompt` after each transcript is available.
- Save the returned JSON as the answer's evaluation payload.
- Use `aggregateCandidateReport` after the interview is complete.

See `METHODOLOGY.md` for the full evaluation approach.
