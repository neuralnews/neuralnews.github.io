# neural_news
import spacy
from textblob import TextBlob

def analysis(text, nlp):
    blob = TextBlob(text)
    sentences = blob.sentences
    results = open("results.txt", "w")
    entities = {}
    for sentence in sentences:
        sentiment = sentence.sentiment
        polarity = sentiment.polarity
        subjectivity = sentiment.subjectivity
        ents = nlp(sentence.raw).ents
        for ent in ents:
            ent_dict = entities.setdefault((ent.text, ent.label_), {})
            ent_dict.setdefault("polarity", 0)
            ent_dict["polarity"] += polarity
            ent_dict.setdefault("subjectivity", 0)
            ent_dict["subjectivity"] += subjectivity
            ent_dict.setdefault("importance", 0)
            ent_dict["importance"] += 1
    # average
    length = len(sentences)
    for ent in entities:
        for key in entities[ent]:
            entities[ent][key] /= float(length)
    print(entities)


def main():
    nlp = spacy.load('en')
    article = open("article.txt", "r").read()
    analysis(article, nlp)



if __name__ == "__main__":
    main()
