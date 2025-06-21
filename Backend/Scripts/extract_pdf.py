import pdfplumber
import sys
import json
import requests # For making HTTP requests to the Gemini API
import os       # For accessing environment variables (like API_KEY)

# Function to extract text from a PDF file
def extract_text_from_pdf(pdf_path):
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = ""
            for page in pdf.pages:
                # Extract text from each page, or an empty string if page.extract_text() is None
                text += page.extract_text() or ""
            return text
    except Exception as e:
        # Log the error to stderr, return a structured error for JSON output
        print(f"ERROR: Failed to extract text from PDF: {str(e)}", file=sys.stderr)
        return {"error": f"Failed to extract text from PDF: {str(e)}"}

# Function to generate MCQ questions using the Gemini API
def generate_mcqs_from_text(text_content):
    # Retrieve API key from environment variable
    # In a real deployment, you might manage API keys more securely
    api_key = os.getenv("GEMINI_API_KEY", "") # Leave empty for Canvas internal API key handling

    # --- DIAGNOSTIC PRINT ADDED ---
    # This will print the length of the API key being used to Node.js stderr.
    # If it shows 0, your API key is not being read by the script.
    print(f"DEBUG: API Key length for Gemini API call: {len(api_key)}", file=sys.stderr)
    # --- END DIAGNOSTIC PRINT ---

    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"

    # Define the prompt for the LLM
    # Requesting specific number of questions and structure
    # CHANGED: Requesting 10 multiple-choice questions instead of 5
    prompt = (
        f"Generate 10 multiple-choice questions (MCQs) from the following text. "
        f"Each question should have 4 options (A, B, C, D) and specify the correct answer letter. "
        f"Ensure questions are clear, concise, and directly related to the text. "
        f"Return the output as a JSON array of objects, where each object has 'question', 'options' (an array of strings), and 'correct_answer' (a string like 'A', 'B', 'C', or 'D').\n\n"
        f"Text: {text_content}"
    )

    # Define the payload for the Gemini API request
    # This includes the prompt and a response schema to guide the LLM's output
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": {
                "type": "ARRAY",
                "items": {
                    "type": "OBJECT",
                    "properties": {
                        "question": {"type": "STRING"},
                        "options": {
                            "type": "ARRAY",
                            "items": {"type": "STRING"},
                            "minItems": 4,
                            "maxItems": 4
                        },
                        "correct_answer": {"type": "STRING"} # Expected values: "A", "B", "C", "D"
                    },
                    "required": ["question", "options", "correct_answer"]
                }
            }
        }
    }

    try:
        # Make the API request
        response = requests.post(api_url, headers={'Content-Type': 'application/json'}, json=payload)
        response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)

        result = response.json()

        if result.get('candidates') and result['candidates'][0].get('content') and result['candidates'][0]['content'].get('parts'):
            # The LLM response is nested; extract the JSON string and parse it
            json_string = result['candidates'][0]['content']['parts'][0]['text']
            # print(f"DEBUG: Raw LLM JSON String: {json_string}", file=sys.stderr) # For debugging LLM output
            return json.loads(json_string)
        else:
            # If LLM response structure is unexpected, log to stderr and return empty
            print(f"ERROR: LLM response structure unexpected: {result}", file=sys.stderr)
            return [] # Return empty list if no candidates or content
    except requests.exceptions.RequestException as e:
        # Log API call errors to stderr, return structured error
        print(f"ERROR: Failed to call Gemini API: {e}", file=sys.stderr)
        return {"error": f"Failed to generate questions (API error): {str(e)}"}
    except json.JSONDecodeError as e:
        # Log JSON parsing errors to stderr, return structured error
        print(f"ERROR: Failed to parse LLM response JSON: {e}", file=sys.stderr)
        # print(f"DEBUG: Problematic JSON string: {json_string}", file=sys.stderr) # Helps debug
        return {"error": f"Failed to parse LLM response JSON: {str(e)}"}
    except Exception as e:
        # Log any other unexpected errors to stderr, return structured error
        print(f"ERROR: An unexpected error occurred during question generation: {e}", file=sys.stderr)
        return {"error": f"An unexpected error occurred during question generation: {str(e)}"}

# Main execution block when the script is run directly
if __name__ == "__main__":
    # Ensure a PDF path is provided as a command-line argument
    if len(sys.argv) < 2:
        # Print error JSON to stdout as this is the primary output expected by Node.js
        print(json.dumps({"error": "No PDF file path provided."}))
        sys.exit(1)

    pdf_path = sys.argv[1] # Get PDF file path from command-line argument
    full_output = {}

    # Step 1: Extract text from the PDF
    extracted_text_result = extract_text_from_pdf(pdf_path)

    if "error" in extracted_text_result:
        # If there's an error in text extraction, return it immediately as JSON
        print(json.dumps({"error": extracted_text_result["error"], "text": "", "questions": []}))
        sys.exit(1)

    extracted_text = extracted_text_result # Access the text directly if no error
    full_output["text"] = extracted_text # Store extracted text

    # Handle cases where extracted text might be empty or too short for meaningful questions
    # A minimum length for useful text is often a good heuristic before calling LLM
    MIN_TEXT_LENGTH_FOR_LLM = 100 # Adjusted from 50 to 100 for better LLM input
    if not extracted_text or len(extracted_text.strip()) < MIN_TEXT_LENGTH_FOR_LLM:
        full_output["questions"] = []
        full_output["warning"] = f"Extracted text is too short ({len(extracted_text.strip())} chars) or empty to generate questions. Minimum required: {MIN_TEXT_LENGTH_FOR_LLM} chars."
        print(f"DEBUG: Text too short for LLM. Length: {len(extracted_text.strip()) if extracted_text else 0}. Returning empty questions.", file=sys.stderr)
    else:
        # Step 2: Generate MCQs from the extracted text using the LLM
        generated_mcqs = generate_mcqs_from_text(extracted_text)

        if "error" in generated_mcqs:
            # If there's an error in question generation, report it but still return extracted text
            full_output["questions"] = [] # No questions generated
            full_output["error"] = generated_mcqs["error"]
            print(f"DEBUG: Question generation failed: {generated_mcqs['error']}", file=sys.stderr)
        else:
            full_output["questions"] = generated_mcqs # Store generated MCQs
            print(f"DEBUG: Successfully generated {len(generated_mcqs)} questions.", file=sys.stderr)

    # Output the combined result as JSON to stdout
    # This is the ONLY thing that should be printed to stdout
    print(json.dumps(full_output))
