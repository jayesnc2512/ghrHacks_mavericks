from elevenlabs import ElevenLabs

client = ElevenLabs(api_key="sk_63b9672cdc305ebf0c4d1a14eda098df879411eab67d665a")

# Convert the text to speech
def text_to_audio(text):
    response = client.text_to_speech.convert(
        voice_id="1qEiC6qsybMkmnNdVMbK",
        # language_code="hi",
        model_id="eleven_multilingual_v2",
        text=text
    )

    temp_audio_file = "output_audio.mp3"
    with open(temp_audio_file, "wb") as audio_file:
        for chunk in response:
            audio_file.write(chunk)
    return temp_audio_file
