# Response Evaluation Methodology

This methodology supports any company-preset interview type while keeping the
evaluation engine independent from the interview flow.

## Evaluation Layers

### 1. Interview Context

The company presets the interview type and role context before the interview:

- Role title and level
- Interview type
- Must-have skills
- Nice-to-have skills
- Optional company evaluation notes

This context influences weighting and final recommendations, but each answer is
still evaluated independently.

### 2. Question Metadata

Each question should eventually store:

- Question text
- Question type
- Question origin
- Difficulty
- Skill tags
- Optional model answer
- Optional extracted model-answer rubric

Question origin matters:

- `predetermined`: selected before the interview.
- `generated_followup`: generated after a candidate response.

### 3. Model Answer Handling

Model answers are optional. When available, they should be converted into a
structured rubric before evaluation.

The model answer becomes:

- Required points
- Bonus points
- Expected red flags
- Evaluation notes

The evaluator should compare against concepts, not exact wording. A candidate
can score well with a valid alternative explanation, and a candidate can exceed
the model answer if they give stronger reasoning.

### 4. Evaluation Modes

`model_answer_based`

Used when a predetermined question has a model answer or extracted rubric.
Evaluation checks required concept coverage, missed concepts, bonus concepts,
incorrect claims, and normal dimensions.

`rubric_only`

Used when a predetermined question has no model answer. Evaluation uses role
context, question type, and dimension weights.

`followup_contextual`

Used for generated follow-ups. Evaluation uses the original question, previous
candidate transcript, generated follow-up question, and follow-up transcript.
The follow-up is judged as a continuation, not as an isolated question.

### 5. Dimension Scoring

Every answer receives dimension scores. Dimensions vary by interview and
question type.

Technical answers emphasize:

- Correctness
- Concept coverage
- Depth
- Clarity
- Examples
- Communication

Behavioral answers emphasize:

- Relevance
- Ownership
- Impact
- Reflection
- Clarity
- Role alignment

System design answers emphasize:

- Requirements understanding
- Architecture
- Tradeoffs
- Scalability
- Failure handling
- Communication

Generated follow-ups emphasize:

- Addressing the follow-up
- Correctness
- Depth expansion
- Consistency
- Adaptability
- Communication

### 6. Follow-Up Evaluation

Generated follow-ups add signal because they show how a candidate responds when
probed.

The evaluator should determine:

- Did the candidate answer the generated follow-up directly?
- Did they improve or deepen the original answer?
- Did they contradict themselves?
- Did they recover from a weak first answer?
- Did the follow-up increase confidence in the skill assessment?

This allows a candidate who initially missed a point to regain credit when they
show understanding after prompting.

### 7. Report Aggregation

The final report aggregates all answer evaluations, but not by a blind average.

Current default:

- Predetermined answers carry full weight.
- Follow-up answers carry slightly lower weight because they are contextual.
- Low-confidence evaluations carry less weight.
- Critical red flags force human review.

The report includes:

- Overall score
- Recommendation
- Recommendation confidence
- Summary
- Strengths
- Weaknesses
- Red flags
- Skill scores
- Question breakdown
- Suggested next steps

### 8. Transcript-Only Now

For now, transcript is the only scoring input. Audio and video fields are
reserved in the schema but disabled in the report.

Future audio/video analysis should be secondary signal only. It should support
review and coaching, not dominate hiring decisions.

## Recommended Implementation Order

1. Store interview context.
2. Store predetermined question metadata.
3. Store candidate transcript for each answer.
4. Store generated follow-up with links to the original question and answer.
5. Extract model-answer rubric where model answers exist.
6. Evaluate each answer into `ResponseEvaluation`.
7. Validate and normalize evaluation JSON.
8. Aggregate evaluations into `CandidateReport`.
