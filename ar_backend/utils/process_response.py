import json

async def process_response(session_id, response):
    try:
        print(response)
        # "```json\n{\n  \"doctors_comment\": \"तुम्हाला कालपासून मळमळ आणि पोटदुखीचा त्रास होत आहे हे कळल्याबद्दल मला वाईट वाटतं. पोटात आग लागल्यासारखं वाटणं आणि अन्न न जाणं यामुळे तुमची गैरसोय नक्कीच झाली असेल. आपण पहिल्यांदाच भेटतोय, त्यामुळे मला तुमच्या तब्येतीबद्दल अधिक माहिती जाणून घ्यायची आहे.\",\n  \"prognosis_reached\": \"false\",\n  \"prognosis\": \"\",\n  \"tests_required\": \"false\",\n  \"tests\": [],\n  \"possible_medications\": [],\n  \"questions\": \"तुम्हाला उलट्या होतात का?\"\n}\n```"

        parsed_json = await parse_json(response)
        if parsed_json:
            print("parsed_json", parsed_json["doctors_comment"])
        else:
            print("Failed to parse JSON.")
    except Exception as e:
        print(f"Error in process_response: {e}")

async def parse_json(response):
    try:
        response = response.replace("json\n", "").replace("```", "").replace("\n","")
        parsed_json = json.loads(response)  # Removed await since json.loads is synchronous
        print("parsed_json", parsed_json)
        return parsed_json
    except json.JSONDecodeError as e:
        print(f"JSON decoding error: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error in parse_json: {e}")
        return None
