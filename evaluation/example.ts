import {
  aggregateCandidateReport,
  buildAnswerEvaluationPrompt,
  buildRubricExtractionPrompt,
  type CandidateResponseInput,
  type InterviewContext,
  type ResponseEvaluation,
} from "./index";

const context: InterviewContext = {
  interviewId: "interview_001",
  candidateId: "candidate_001",
  roleTitle: "Backend Engineer",
  roleLevel: "Junior",
  interviewType: "technical",
  mustHaveSkills: ["Databases", "APIs", "Problem solving"],
};

const predeterminedAnswer: CandidateResponseInput = {
  answerId: "answer_001",
  question: {
    questionId: "question_001",
    questionText: "Explain how database indexing works.",
    questionType: "technical_theory",
    questionOrigin: "predetermined",
    difficulty: "medium",
    skillTags: ["databases"],
    modelAnswer:
      "Database indexes improve lookup speed by maintaining a separate data structure such as a B-tree or hash index, reducing full table scans. They can add storage cost and slow writes.",
  },
  response: {
    source: "transcript",
    transcript:
      "Indexes help the database find records faster without checking every row. They are useful on columns that are queried often.",
  },
};

const followupAnswer: CandidateResponseInput = {
  answerId: "answer_002",
  question: {
    questionId: "question_002",
    questionText: "What are the downsides of adding too many indexes?",
    questionType: "followup",
    questionOrigin: "generated_followup",
    skillTags: ["databases"],
  },
  followupContext: {
    originalQuestionId: "question_001",
    originalQuestionText: predeterminedAnswer.question.questionText,
    originalTranscript: predeterminedAnswer.response.transcript,
    generatedFollowupQuestion: "What are the downsides of adding too many indexes?",
  },
  response: {
    source: "transcript",
    transcript:
      "Too many indexes can use more storage and make inserts or updates slower because the database has to keep the indexes updated.",
  },
};

export const rubricPromptExample = buildRubricExtractionPrompt(predeterminedAnswer.question);
export const predeterminedEvaluationPromptExample = buildAnswerEvaluationPrompt(
  context,
  predeterminedAnswer,
);
export const followupEvaluationPromptExample = buildAnswerEvaluationPrompt(context, followupAnswer);

const sampleEvaluations: ResponseEvaluation[] = [
  {
    answerId: "answer_001",
    questionId: "question_001",
    questionOrigin: "predetermined",
    evaluationMode: "model_answer_based",
    overallScore: 76,
    dimensionScores: {
      correctness: {
        score: 82,
        reason: "The candidate accurately explained the main purpose of indexes.",
      },
      concept_coverage: {
        score: 70,
        reason: "They covered lookup speed and avoiding row scans but missed write/storage tradeoffs.",
      },
      depth: {
        score: 68,
        reason: "The answer stayed at a basic level.",
      },
      clarity: {
        score: 88,
        reason: "The explanation was concise and easy to understand.",
      },
      examples: {
        score: 65,
        reason: "The answer mentioned queried columns but did not give a concrete example.",
      },
      communication: {
        score: 84,
        reason: "The candidate communicated cleanly.",
      },
    },
    modelAnswerComparison: {
      coveredRequiredPoints: ["Improves lookup speed", "Reduces scanning every row"],
      missedRequiredPoints: ["Separate data structure"],
      coveredBonusPoints: [],
      incorrectClaims: [],
    },
    strengths: ["Clear explanation of the core purpose of indexing"],
    weaknesses: ["Missed storage and write-performance tradeoffs in the first answer"],
    redFlags: [],
    followUpRecommendations: ["Ask when an index may not be used by the query planner"],
    evaluationConfidence: "high",
    summary: "Good foundational answer with limited tradeoff depth.",
    transcriptOnly: true,
  },
  {
    answerId: "answer_002",
    questionId: "question_002",
    questionOrigin: "generated_followup",
    evaluationMode: "followup_contextual",
    overallScore: 86,
    dimensionScores: {
      addressed_followup: {
        score: 95,
        reason: "The candidate directly answered the downside question.",
      },
      correctness: {
        score: 90,
        reason: "The tradeoffs mentioned were accurate.",
      },
      depth_expansion: {
        score: 82,
        reason: "The follow-up added detail missing from the original answer.",
      },
      consistency: {
        score: 90,
        reason: "The answer did not contradict the original response.",
      },
      adaptability: {
        score: 80,
        reason: "The candidate recovered a missing tradeoff when probed.",
      },
      communication: {
        score: 85,
        reason: "The response was concise and structured.",
      },
    },
    followupAnalysis: {
      addressedFollowup: true,
      improvedPreviousAnswer: true,
      contradictedPreviousAnswer: false,
      handledProbeWell: true,
      followupValue: "high",
      reason: "The follow-up revealed tradeoff awareness not shown in the first answer.",
    },
    strengths: ["Improved the original answer when probed"],
    weaknesses: ["Needed prompting to mention tradeoffs"],
    redFlags: [],
    followUpRecommendations: ["Probe query planner behavior and index selectivity"],
    evaluationConfidence: "high",
    summary: "Strong follow-up that increased confidence in database fundamentals.",
    transcriptOnly: true,
  },
];

export const candidateReportExample = aggregateCandidateReport(context, sampleEvaluations);
