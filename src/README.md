# Process scene text.
The goal is to make it so that each line of Japanese text is accompanied by its exact English translation.

While the script does keep related lines next to each other, much of the text is not consistently formatted. Linebreaks in a dialogue box are completely separated into separate lines in the source spreadsheet. Because the number of lines change between the Japanese and English text, this means not all of the meaning is preserved line-by-line.

Fortunately most of the multi-line dialogue boxes have opening and closing markers. However, even with this, it's not enough. Sometimes dialogue boxes are split into multiple dialogue boxes due to translation requirements. Sometimes multiple boxes get crunched into one. Sometimes, opening markers aren't present. Other times, closing markers aren't present. Sometimes it uses Japanese markers in the English text, and English markers in the Japanese text.

What I've opted to do in light of this is to just crunch all multi-line texts into 1 line. In order to accomplish this, I wrote a script that does the following:

* trim all dialogue entries, removing unnecessary whitespace from the beginnings and ends.
* collapses all quote blocks in the English script (blocks that start with opening quotations “ and end with closing quotations ”) into 1 line;
* collapses all quote blocks in the Japanese script (blocks that start with opening brackets 「 and end with closing brackets 」) into 1 line;
* detects the beginning of quote blocks before the end of a quote block, and assumes the previous quote block ends there;
* removes all empty lines from both scripts;

Due to inconsistencies in the source spreadsheet, you have to do quite a lot of manual fixes. Most of them consist of:
* adding missing closing markers;
* adding opening and closing markers;
* removing incorrectly placed closing markers;
* replacing inconsistent opening/closing markers;
* re-combining dialogue that was split into multiple boxes due to space requirements (and other reasons) in the translated text;
* adding missing translations.

The ultimate goal is to have it so that the text in the English script has the exact same number of "lines" as the text in the Japanese script. Once all this formatting is done, each line in the English script is attached to the same line in the Japanese script. Matching lines is the only important thing.

This function is implemented in the `process.js` file and is its sole export.

## Process all scene text automatically.
Automatically processes all formatted scenes and stores them in the processed folder.

Syntax: `node process-all`

## Process a mock scene file.
Processes the formatted script from `./formatted.txt` and pops out the processed script in `./processed.txt`.

Syntax: `node quick`

## Generate scene tables for easy reading on Github.
Generates a table for each scene's dialogue using markdown.

The resulting files are stored in `../scene/tabulated/`.

Syntax: `node generate-scene-tables`

## Split Japanese and English scene text.
Split the English and Japanese entries for each line in each scene.

English scene text is stored in `../scene/split/english/`.

Japanese scene text is stored in `../scene/split/Japanese/`.

Syntax: `node generate-split-script`

## Extract kanji usage data from all scene files.
Generates a kanji table and stores it in `kanji.JSON` for use in other scripts.

Syntax: `node generate-kanji-table`

## Create ordered kanji lists.
Uses `kanji.JSON` to generate kanji lists in order of appearance, and in order of occurrences.

The resulting files are stored in `../kanji/`.

Syntax: `node generate-kanji-order`

## Analyze kanji data.
Generate a markdown file containing data about all kanji that appear in the script.

The resulting file is stored in `../kanji/README.md`.

Syntax: `node generate-kanji-readme`

# Display the most recent version tag.
Strictly for use with uploading to Ankiweb.

Syntax: `node latest`

# Use Mecab to tokenize Japanese.
I wrote a quick wrapper for the commandline Mecab tool. It returns individuals units of language in Japanese, which allows me to pretty accurately scrape words from a Japanese sentence.

Mecab tokenizer function is exported by `mecab-wrapper.js`.

# Easy dictionary lookup.
A copy of JSdict can be loaded into memory, and you can easily look up words.

The lookup function is exported by `jsdict-lookup.js`.

## Generate vocabulary lists.
Generates a list of all vocabulary found in every scene.

Vocabulary lists are stored as JSON in `../vocabulary/unprocessed/`.

Designed to be processed through the vocab disambiguator webserver.

**This is a very costly operation.**
This uses MeCab to parse every single line of every single scene.
It takes over 10 minutes for this to complete.

Syntax: `node generate-vocabulary-list`

## Web app for disambiguating vocabulary.
I created a web-app that allows you to quickly and easily disambiguate words found in each scene. It uses the JSON files generated by `generate-vocabulary-list` to do this.

Disambiguated vocabulary files are stored in `../vocabulary/processed/`.

Syntax: `node disambugator`

This starts the webserver. You'll need to visit it at `http://localhost/` to use it.