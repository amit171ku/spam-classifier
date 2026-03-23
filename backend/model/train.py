import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib, re, nltk
from nltk.corpus import stopwords

STOP = set(stopwords.words('english'))

def clean(text):
    text = text.lower()
    text = re.sub(r'http\S+', ' URL ', text)
    text = re.sub(r'\d+', ' NUM ', text)
    text = re.sub(r'[^a-z\s]', ' ', text)
    words = [w for w in text.split() if w not in STOP]
    return ' '.join(words)

df = pd.read_csv('data/spam.csv', sep='\t', header=None, names=['label','text'])
df['clean'] = df['text'].apply(clean)
df['target'] = (df['label'] == 'spam').astype(int)

X_tr, X_te, y_tr, y_te = train_test_split(
    df['clean'], df['target'], test_size=0.2, random_state=42)

pipe = Pipeline([
    ('tfidf', TfidfVectorizer(ngram_range=(1,2), max_features=10000)),
    ('clf',   MultinomialNB(alpha=0.1))
])
pipe.fit(X_tr, y_tr)
print(classification_report(y_te, pipe.predict(X_te)))
joblib.dump(pipe, 'backend/model/spam_model.pkl')
print("Model saved!")