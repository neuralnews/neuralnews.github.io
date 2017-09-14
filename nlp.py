# neural_news
import spacy
from textblob import TextBlob

nlp = spacy.load('en')
article = "For a few minutes on Thursday morning it appeared that Donald Trump -- the man who launched his presidential campaign by deriding immigrants and bathed in chants of \"build the wall\" at campaign rallies -- was open to a pathway to citizenship for undocumented immigrants in the United States. Then the President spoke for himself. In a series of statements to reporters on Thursday, the White House appeared to be debating itself over what the President would agree to on immigration reform, whether any deal hinged on funding for a wall along the US-Mexico border and what exactly constituted amnesty. Trump kicked off the internal -- yet public -- debate as he left the White House for a trip to Florida to inspect damage wrought by Hurricane Irma. \"The wall will come later,\" the President said, reflecting on a framework Trump agreed to with the two top Democrats in Congress -- Sen. Chuck Schumer and Rep. Nancy Pelosi -- over dinner of Chinese food and chocolate pie on Wednesday"
#text2 = 'Hello, friend.'

#doc = nlp(article)
blob = TextBlob(article)

for sentence in blob.sentences:
    print(sentence.text)
    print(sentence.sentiment)
    for ent in nlp(sentence).ents:
        print(ent.label_, ent.text)
