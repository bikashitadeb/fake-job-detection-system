import os
try:
    import joblib  # type: ignore
except Exception:
    # Fallback: try sklearn's vendored joblib (older sklearn)
    try:
        from sklearn.externals import joblib  # type: ignore
    except Exception:
        # Final fallback: create minimal joblib-like wrapper around pickle
        import pickle

        class _JoblibFallback:
            @staticmethod
            def dump(obj, filename):
                with open(filename, "wb") as f:
                    pickle.dump(obj, f)

            @staticmethod
            def load(filename):
                with open(filename, "rb") as f:
                    return pickle.load(f)

        joblib = _JoblibFallback()
import pandas as pd  # type: ignore

from sklearn.feature_extraction.text import TfidfVectorizer  # type: ignore
from sklearn.model_selection import train_test_split  # type: ignore
from sklearn.naive_bayes import MultinomialNB  # type: ignore
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score  # type: ignore


# ----------------------------------------
# Dataset Path
# ----------------------------------------

DATASET_PATH = "app/ai/dataset/fake_job_postings.csv"


# ----------------------------------------
# Load Dataset
# ----------------------------------------

df = pd.read_csv(DATASET_PATH)

print("Dataset Loaded Successfully")
print("Total Records:", len(df))


# ----------------------------------------
# Keep Required Columns
# ----------------------------------------

df = df[["description", "fraudulent"]]

df = df.dropna()


# ----------------------------------------
# Features & Labels
# ----------------------------------------

X = df["description"]

y = df["fraudulent"]


# ----------------------------------------
# TF-IDF Vectorizer
# ----------------------------------------

vectorizer = TfidfVectorizer(
    stop_words="english",
    max_features=5000
)

X_vectorized = vectorizer.fit_transform(X)


# ----------------------------------------
# Train Test Split
# ----------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X_vectorized,
    y,
    test_size=0.2,
    random_state=42
)


# ----------------------------------------
# Train Model
# ----------------------------------------

model = MultinomialNB()

model.fit(X_train, y_train)


# ----------------------------------------
# Accuracy
# ----------------------------------------

predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print("Model Accuracy:", round(accuracy * 100, 2), "%")


# ----------------------------------------
# Save Model
# ----------------------------------------

SAVE_FOLDER = "app/ai/saved_models"

os.makedirs(SAVE_FOLDER, exist_ok=True)

joblib.dump(
    model,
    os.path.join(SAVE_FOLDER, "fake_job_model.pkl")
)

joblib.dump(
    vectorizer,
    os.path.join(SAVE_FOLDER, "tfidf_vectorizer.pkl")
)

print("Model Saved Successfully!")
print("Vectorizer Saved Successfully!")