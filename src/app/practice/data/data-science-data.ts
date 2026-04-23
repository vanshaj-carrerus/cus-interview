import { TopicData } from "./types";

export const dataScienceData: TopicData = {
  slug: "data-science",
  title: "Data Science",
  intro: "Build intuition in statistics, models, and data workflows.",
  levels: [
    {
      level: 1,
      title: "Data Science Foundations",
      description: "Basic stats and data understanding.",
      passScore: 2,
      questions: [
        {
          id: "ds-1",
          question: "What does mean represent in a dataset?",
          options: ["Middle value", "Most frequent value", "Average value", "Range"],
          answerIndex: 2,
          explanation: "Mean is the arithmetic average.",
        },
        {
          id: "ds-2",
          question: "What is overfitting?",
          options: [
            "Model performs well on training but poorly on new data",
            "Model fails on training data only",
            "Model runs too fast",
            "Data has no null values",
          ],
          answerIndex: 0,
          explanation: "Overfitting means the model memorizes training noise.",
        },
        {
          id: "ds-3",
          question: "Why is train-test split useful?",
          options: [
            "To reduce feature count",
            "To check generalization on unseen data",
            "To store data in two files",
            "To remove duplicates automatically",
          ],
          answerIndex: 1,
          explanation: "It helps evaluate how model performs on unseen data.",
        },
      ],
    },
    {
      level: 2,
      title: "Model Evaluation",
      description: "Pick metrics and validate model quality.",
      passScore: 2,
      questions: [
        {
          id: "ds-4",
          question: "Which metric is useful for classification?",
          options: ["RMSE", "MAE", "Accuracy", "R-squared"],
          answerIndex: 2,
          explanation: "Accuracy is commonly used for classification tasks.",
        },
        {
          id: "ds-5",
          question: "What does precision measure?",
          options: [
            "Correct positives out of predicted positives",
            "Correct negatives out of all negatives",
            "Correct answers out of all samples",
            "Average model loss only",
          ],
          answerIndex: 0,
          explanation: "Precision focuses on correctness of positive predictions.",
        },
        {
          id: "ds-6",
          question: "Cross-validation helps by:",
          options: [
            "Increasing data duplication",
            "Evaluating stability across folds",
            "Removing outliers always",
            "Replacing feature engineering",
          ],
          answerIndex: 1,
          explanation: "It checks model consistency across multiple splits.",
        },
      ],
    },
  ],
};
