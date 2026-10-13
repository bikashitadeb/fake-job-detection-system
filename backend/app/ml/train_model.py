import pandas as pd

import joblib

from sklearn.pipeline import Pipeline

from sklearn.feature_extraction.text import TfidfVectorizer

from sklearn.linear_model import LogisticRegression

from sklearn.model_selection import train_test_split


# Load dataset

data = pd.read_csv(
    "fake_job_dataset.csv"
)


X = data["description"]

y = data["label"]



X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)



model = Pipeline([

    (
        "tfidf",
        TfidfVectorizer(
            stop_words="english"
        )
    ),

    (
        "classifier",
        LogisticRegression()
    )

])



model.fit(
    X_train,
    y_train
)



accuracy = model.score(
    X_test,
    y_test
)



print(
    "Model Accuracy:",
    accuracy
)



joblib.dump(
    model,
    "fake_job_model.pkl"
)



print(
    "Model saved successfully"
)