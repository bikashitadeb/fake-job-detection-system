import pandas as pd
import joblib
import re
import os


from sklearn.model_selection import train_test_split

from sklearn.feature_extraction.text import TfidfVectorizer

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)


from xgboost import XGBClassifier

from scipy.sparse import hstack



# ==========================================
# LOAD DATASET
# ==========================================


DATA_PATH = "../../dataset/fake_job_postings.csv"


df = pd.read_csv(DATA_PATH)



print(df.head())

print("Dataset Shape:", df.shape)



# ==========================================
# HANDLE MISSING VALUES
# ==========================================


df = df.fillna("")





# ==========================================
# CREATE COMBINED TEXT FEATURE
# ==========================================


df["combined_text"] = (

    df["title"]

    + " "

    + df["company_profile"]

    + " "

    + df["description"]

    + " "

    + df["requirements"]

    + " "

    + df["benefits"]

    + " "

    + df["industry"]

    + " "

    + df["function"]

)





# ==========================================
# NLP FEATURE ENGINEERING
# ==========================================



SUSPICIOUS_WORDS = [

    "urgent",

    "guaranteed",

    "money",

    "pay",

    "fee",

    "deposit",

    "whatsapp",

    "telegram",

    "easy money",

    "work from home",

    "no experience",

    "limited seats"

]





def suspicious_count(text):


    text = text.lower()


    count = 0


    for word in SUSPICIOUS_WORDS:


        if word in text:

            count += 1



    return count





df["suspicious_count"] = (

    df["combined_text"]

    .apply(suspicious_count)

)







# Description length

df["description_length"] = (

    df["description"]

    .apply(len)

)






# Company profile available

df["company_profile_exists"] = (

    df["company_profile"]

    .apply(

        lambda x:

        1 if len(x)>10 else 0

    )

)





# ==========================================
# INPUT AND LABEL
# ==========================================


X_text = df["combined_text"]


y = df["fraudulent"]





# ==========================================
# TRAIN TEST SPLIT
# ==========================================


X_train_text, X_test_text, y_train, y_test = train_test_split(

    X_text,

    y,

    test_size=0.2,

    random_state=42,

    stratify=y

)





# ==========================================
# TF-IDF VECTORIZATION
# ==========================================


vectorizer = TfidfVectorizer(

    max_features=15000,

    stop_words="english",

    ngram_range=(1,2)

)



X_train_tfidf = vectorizer.fit_transform(

    X_train_text

)



X_test_tfidf = vectorizer.transform(

    X_test_text

)





# ==========================================
# ADD NUMERICAL FEATURES
# ==========================================



train_indices = X_train_text.index

test_indices = X_test_text.index




extra_train = df.loc[

    train_indices,

    [

        "suspicious_count",

        "description_length",

        "company_profile_exists"

    ]

].values



extra_test = df.loc[

    test_indices,

    [

        "suspicious_count",

        "description_length",

        "company_profile_exists"

    ]

].values







X_train_final = hstack(

    [

        X_train_tfidf,

        extra_train

    ]

)



X_test_final = hstack(

    [

        X_test_tfidf,

        extra_test

    ]

)







# ==========================================
# TRAIN XGBOOST MODEL
# ==========================================



model = XGBClassifier(

    n_estimators=300,

    max_depth=6,

    learning_rate=0.05,

    subsample=0.8,

    colsample_bytree=0.8,

    eval_metric="logloss",

    random_state=42

)





model.fit(

    X_train_final,

    y_train

)







# ==========================================
# EVALUATION
# ==========================================



prediction = model.predict(

    X_test_final

)



print(

    "Accuracy:",

    accuracy_score(

        y_test,

        prediction

    )

)



print(

    confusion_matrix(

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







# ==========================================
# SAVE MODEL
# ==========================================



MODEL_PATH = "fake_job_model.pkl"

VECTOR_PATH = "tfidf_vectorizer.pkl"





joblib.dump(

    model,

    MODEL_PATH

)



joblib.dump(

    vectorizer,

    VECTOR_PATH

)




print(

    "Enhanced AI Model Saved Successfully"

)