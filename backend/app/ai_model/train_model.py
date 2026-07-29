import pandas as pd

from sklearn.model_selection import train_test_split

from sklearn.feature_extraction.text import TfidfVectorizer

from sklearn.linear_model import LogisticRegression

from sklearn.metrics import accuracy_score, classification_report

import joblib



# Load dataset

df = pd.read_csv(
    "../../dataset/fake_job_postings.csv"
)



print(df.head())

print(df.shape)



# Fill missing values

df = df.fillna("")



# Combine important text fields

df["combined_text"] = (

    df["title"]

    + " "

    +

    df["company_profile"]

    + " "

    +

    df["description"]

    + " "

    +

    df["requirements"]

    + " "

    +

    df["benefits"]

)





X = df["combined_text"]


y = df["fraudulent"]





# Split dataset

X_train, X_test, y_train, y_test = train_test_split(

    X,

    y,

    test_size=0.2,

    random_state=42

)






# Convert text to numbers

vectorizer = TfidfVectorizer(

    max_features=5000,

    stop_words="english"

)



X_train_vector = vectorizer.fit_transform(

    X_train

)


X_test_vector = vectorizer.transform(

    X_test

)







# Train model

model = LogisticRegression(

    max_iter=1000

)



model.fit(

    X_train_vector,

    y_train

)






# Test

prediction = model.predict(

    X_test_vector

)



print(

    "Accuracy:",

    accuracy_score(

        y_test,

        prediction

    )

)


print(

    classification_report(

        y_test,

        prediction

    )

)







# Save model

joblib.dump(

    model,

    "fake_job_model.pkl"

)



joblib.dump(

    vectorizer,

    "tfidf_vectorizer.pkl"

)



print(
    "Model saved successfully"
)