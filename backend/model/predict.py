import joblib, re, os
from nltk.corpus import stopwords

STOP = set(stopwords.words('english'))
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'spam_model.pkl')
model = joblib.load(MODEL_PATH)

SPAM_KEYWORDS = [
    'winner','lottery','prize','urgent','free','act now',
    'click here','claim','bank details','congratulations',
    'unsubscribe','offer expires','limited time','guaranteed',
    'earn money','work from home','extra income','per month',
    'click below','order now','special promotion','discount',
    'dear friend','dear customer','you have been selected',
    'risk free','no cost','incredible deal','this is not spam',
    'wfh','part time work','campus ambassador','stipend',
    'work from home opportunity','earn','lpa package',
    'placement opportunity','hello learner','hello dear',
    'free courses','letter of recommendation','based on performance',
    'promote our','valuable experience','smarted','innovations'
]
PHISHING_KW = [
    'verify now','account suspended','enter password',
    'credit card','unusual activity','restore access',
    'confirm your account','update your information',
    'your account will be closed','login immediately',
    'verify your identity','billing information',
    'deliver your message','click here to deliver',
    'bcc: me','why is this message in spam'
]

def clean(text):
    text = text.lower()
    text = re.sub(r'http\S+', ' URL ', text)
    text = re.sub(r'\d+', ' NUM ', text)
    text = re.sub(r'[^a-z\s]', ' ', text)
    return ' '.join([w for w in text.split() if w not in STOP])

def rule_check(text):
    t = text.lower()
    reasons = []
    score = 0
    found_spam  = [k for k in SPAM_KEYWORDS if k in t]
    found_phish = [k for k in PHISHING_KW  if k in t]
    if found_spam:  
        reasons.append(f"Spam keywords: {', '.join(found_spam[:3])}"); score += 20
    if found_phish: 
        reasons.append("Phishing phrases detected"); score += 35
    caps = re.findall(r'\b[A-Z]{3,}\b', text)
    if len(caps) >= 3: 
        reasons.append(f"ALL CAPS abuse ({len(caps)}x)"); score += 10
    excl = re.findall(r'!{2,}', text)
    if excl: 
        reasons.append("Multiple exclamation marks"); score += 8
    urls = re.findall(r'https?://\S+', t)
    if len(urls) > 2: 
        reasons.append(f"Too many links ({len(urls)})"); score += 10

    # WFH/Job scam pattern
    wfh_signals = ['work from home', 'wfh', 'part time', 'campus ambassador', 
                   'stipend', 'earn', 'lpa', 'placement']
    found_wfh = [w for w in wfh_signals if w in t]
    if len(found_wfh) >= 2:
        reasons.append(f"Job scam pattern: {', '.join(found_wfh[:3])}")
        score += 30

    # Too good to be true money promises
    money_signals = ['5,000','10,000','lpa','stipend','free courses','certificate']
    found_money = [m for m in money_signals if m in t]
    if len(found_money) >= 2:
        reasons.append("Unrealistic money/benefit promises")
        score += 25

    return score, reasons, bool(found_phish)

def predict(text: str):
    ml_prob = model.predict_proba([clean(text)])[0][1]
    rule_score, reasons, is_phish = rule_check(text)
    combined = min(0.99, ml_prob + rule_score / 200)
    if is_phish and combined > 0.6: verdict = "phishing"
    elif combined > 0.5:            verdict = "spam"
    else:                           verdict = "ham"
    return {
        "verdict": verdict,
        "confidence": round(combined * 100, 1),
        "reasons": reasons or ["No suspicious indicators found"],
        "ml_score": round(ml_prob * 100, 1)
    }
