import spacy

nlp = spacy.load('en')
nlp.save_to_directory('en_model')
