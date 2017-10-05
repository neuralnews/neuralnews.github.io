# neural_news
import spacy
from textblob import TextBlob
import json
import sys



def ents_to_json(entities, total_ents):
    top_importance = []
    # convert dictionary to list for sorting
    for ent in entities:
        top_importance.append(entities[ent])

    top_importance.sort(key=lambda x: x["importance"])

    json.dumps(top_importance)

    return top_importance[:total_ents]

def avg_ents(entities, length):
    for ent in entities:
        for key in entities[ent]:
            if (key != "name"):
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

def get_entities(sentences, nlp):
    entities = {}

    # populate
    for sentence in sentences:
        sentiment = sentence.sentiment
        polarity = sentiment.polarity
        subjectivity = sentiment.subjectivity
        ents = nlp(sentence.raw).ents
        for ent in ents:
            ent_dict = entities.setdefault((ent.text, ent.label_), {})
            ent_dict.setdefault("name", ent.text)
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

    return entities

def analysis(text, nlp):
    blob = TextBlob(text)
    sentences = blob.sentences
    # results = open("results.txt", "w")

    # get 2D entity dictionry
    entities = get_entities(sentences, nlp)

    # TODO sort and convert to json
    total_ents = 3
    json_ents = ents_to_json(entities, total_ents)

    return json_ents


def main():
    article = sys.argv[1]
    nlp = spacy.load('en')
    #article = open("article.txt", "r").read()
    return analysis(article, nlp)



if __name__ == "__main__":
    main()
