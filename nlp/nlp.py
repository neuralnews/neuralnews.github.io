# neural_news
import spacy
from textblob import TextBlob

def avg_ents(entities, length):
    for ent in entities:
        for key in entities[ent]:
            entities[ent][key] /= float(length)

    return entities

def filter_unimportant_enttypes(entities):
    unimp_types = ["DATE", "TIME", "PERCENT", "MONEY", "QUANTITY", "ORDINAL", "CARDINAL"]
    ents_to_delete = []
    for ent in entities:
        if ent[1] in unimp_types:
            ents_to_delete.append(ent)
    for ent in ents_to_delete:
        del entities[ent]

    return entities

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
    entities = avg_ents(entities, len(sentences))

    # remove types DATE TIME PERCENT MONEY QUANTITY ORDINAL CARDINAL
    entities = filter_unimportant_enttypes(entities)

    # TODO sort and convert to json

    print(entities)


def main():
    nlp = spacy.load('en')
    article = open("article.txt", "r").read()
    analysis(article, nlp)



if __name__ == "__main__":
    main()