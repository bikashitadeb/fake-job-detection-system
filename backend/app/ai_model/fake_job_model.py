# app/ai_model/fake_job_model.py


import os
import joblib
import pandas as pd



from sklearn.model_selection import train_test_split

from sklearn.feature_extraction.text import TfidfVectorizer

from sklearn.linear_model import LogisticRegression

from sklearn.metrics import accuracy_score, classification_report





# =====================================================
# PATH CONFIGURATION
# =====================================================


BASE_DIR = os.path.dirname(

    os.path.dirname(

        os.path.abspath(__file__)

    )

)



DATASET_PATH = os.path.join(

    BASE_DIR,

    "dataset",

    "fake_job_postings.csv"

)



MODEL_PATH = os.path.join(

    BASE_DIR,

    "ai_model",

    "fake_job_model.pkl"

)



VECTORIZER_PATH = os.path.join(

    BASE_DIR,

    "ai_model",

    "tfidf_vectorizer.pkl"

)








# =====================================================
# DATA PREPARATION
# =====================================================


def prepare_dataset():



    df = pd.read_csv(

        DATASET_PATH

    )





    df = df.fillna("")





    # Combine text features


    df["combined_text"] = (

        df["title"].astype(str)

        +

        " "

        +

        df["company_profile"].astype(str)

        +

        " "

        +

        df["description"].astype(str)

        +

        " "

        +

        df["requirements"].astype(str)

        +

        " "

        +

        df["benefits"].astype(str)

    )





    X = df["combined_text"]



    y = df["fraudulent"]





    return X,y










# =====================================================
# TRAIN MODEL
# =====================================================


def train_model():



    print(

        "Loading dataset..."

    )



    X,y = prepare_dataset()





    X_train,X_test,y_train,y_test = train_test_split(

        X,

        y,

        test_size=0.2,

        random_state=42,

        stratify=y

    )







    print(

        "Creating TF-IDF vectors..."

    )



    vectorizer = TfidfVectorizer(

        max_features=10000,

        stop_words="english",

        ngram_range=(1,2)

    )







    X_train_vector = vectorizer.fit_transform(

        X_train

    )



    X_test_vector = vectorizer.transform(

        X_test

    )









    print(

        "Training Logistic Regression..."

    )



    model = LogisticRegression(

        max_iter=1000,

        class_weight="balanced"

    )





    model.fit(

        X_train_vector,

        y_train

    )









    predictions = model.predict(

        X_test_vector

    )






    accuracy = accuracy_score(

        y_test,

        predictions

    )





    print(

        "MODEL ACCURACY:",

        accuracy

    )





    print(

        classification_report(

            y_test,

            predictions

        )

    )









    # Save model


    joblib.dump(

        model,

        MODEL_PATH

    )



    joblib.dump(

        vectorizer,

        VECTORIZER_PATH

    )







    print(

        "Model saved successfully"

    )





    return model











# =====================================================
# LOAD MODEL
# =====================================================


def load_model():



    if not os.path.exists(MODEL_PATH):


        train_model()





    model = joblib.load(

        MODEL_PATH

    )



    vectorizer = joblib.load(

        VECTORIZER_PATH

    )




    return model,vectorizer












# =====================================================
# PREDICT SINGLE JOB
# =====================================================


def predict_job(job_data):



    model,vectorizer = load_model()






    text = (


        job_data.get(

            "title",

            ""

        )


        +

        " "


        +

        job_data.get(

            "company",

            ""

        )



        +

        " "



        +

        job_data.get(

            "description",

            ""

        )



        +

        " "



        +

        job_data.get(

            "requirements",

            ""

        )


    )







    vector = vectorizer.transform(

        [text]

    )







    prediction = model.predict(

        vector

    )[0]





    probability = model.predict_proba(

        vector

    )[0][1]







    return {



        "is_fake":

        bool(prediction),




        "fake_probability":

        round(

            probability * 100,

            2

        ),




        "trust_score":

        round(

            (1-probability)*100,

            2

        ),




        "model":

        "Logistic Regression",




        "version":

        "1.0"



    }









# =====================================================
# MAIN TRAINING EXECUTION
# =====================================================


if __name__ == "__main__":


    train_model()