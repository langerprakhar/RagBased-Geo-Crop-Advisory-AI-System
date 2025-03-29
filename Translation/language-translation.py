from googletrans import Translator

def translate_text(input_text, src_language, dest_language):
    # Initialize the Translator
    translator = Translator()
    
    # Perform the translation
    result = translator.translate(input_text, src=src_language, dest=dest_language)
    
    # Print the results
    print(f"Original Text: {result.origin}")
    print(f"Detected Language: {result.src}")
    print(f"Translated Text: {result.text}")
    print(f"Target Language: {result.dest}")

# Example usage
if __name__ == "__main__":
    text_to_translate = "Welcome to our tutorial!"
    source_language = 'en'  # English
    target_language = 'hi'   # Hindi , ml for malayalam, te for telugu, etc.

    translate_text(text_to_translate, source_language, target_language)
