# neural_news
from textblob import TextBlob
import json
import sys

def analysis(text):
    blob      = TextBlob(text)
    sentences = blob.sentences
    result    = []
    for sentence in sentences:
        result.append({
            "text"     : str(sentence),
            "polarity" : str(sentence.polarity)
        })
    try:
        print(json.dumps(result))
    except:
        print("error")

def main():
    article = sys.argv[1]
    return analysis(article)

if __name__ == "__main__":
    main()
