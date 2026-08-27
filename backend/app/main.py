import os
import sys

# Add parent directory to sys.path to allow absolute imports of 'app'
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# pyrefly: ignore [missing-import]
from flask import Flask, request, jsonify
from flask_cors import CORS

from app.adapters.repositories.json_character_repository import JsonCharacterRepository
from app.core.use_cases.add_character import AddCharacter
from app.core.use_cases.list_characters_by_order import ListCharactersByOrder
from app.core.use_cases.delete_character import DeleteCharacter
from app.core.use_cases.damage_character import DamageCharacter
from app.core.use_cases.heal_character import HealCharacter
from app.core.use_cases.update_character_order import UpdateCharacterOrder

app = Flask(__name__)
# Enable CORS for all routes so our frontend can connect
CORS(app)

# Resolve file path for JSON persistence in data directory
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data'))
JSON_FILE_PATH = os.path.join(DATA_DIR, 'characters.json')

# Instantiate the repository and use cases
repository = JsonCharacterRepository(JSON_FILE_PATH)
add_character_use_case = AddCharacter(repository)
list_characters_use_case = ListCharactersByOrder(repository)
delete_character_use_case = DeleteCharacter(repository)
damage_character_use_case = DamageCharacter(repository)
heal_character_use_case = HealCharacter(repository)
update_order_use_case = UpdateCharacterOrder(repository)


@app.route('/api/characters', methods=['GET'])
def list_characters():
    try:
        characters = list_characters_use_case.execute()
        return jsonify([c.to_dict() for c in characters]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/characters', methods=['POST'])
def add_character():
    data = request.get_json() or {}
    required = ["name", "character_type", "max_hp", "current_hp", "order"]
    
    # Simple validation for fields presence
    missing = [field for field in required if field not in data]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        char = add_character_use_case.execute(
            name=data["name"],
            character_type=data["character_type"],
            max_hp=int(data["max_hp"]),
            current_hp=int(data["current_hp"]),
            order=int(data["order"])
        )
        return jsonify(char.to_dict()), 201
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/characters/<string:character_id>', methods=['DELETE'])
def delete_character(character_id):
    try:
        delete_character_use_case.execute(character_id)
        return jsonify({"message": f"Character with ID '{character_id}' deleted successfully."}), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/characters/<string:character_id>/damage', methods=['POST'])
def damage_character(character_id):
    data = request.get_json() or {}
    if "amount" not in data:
        return jsonify({"error": "Missing required field: amount"}), 400

    try:
        char = damage_character_use_case.execute(character_id, int(data["amount"]))
        return jsonify(char.to_dict()), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/characters/<string:character_id>/heal', methods=['POST'])
def heal_character(character_id):
    data = request.get_json() or {}
    if "amount" not in data:
        return jsonify({"error": "Missing required field: amount"}), 400

    try:
        char = heal_character_use_case.execute(character_id, int(data["amount"]))
        return jsonify(char.to_dict()), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/characters/<string:character_id>/order', methods=['PATCH'])
def update_character_order(character_id):
    data = request.get_json() or {}
    if "order" not in data:
        return jsonify({"error": "Missing required field: order"}), 400

    try:
        char = update_order_use_case.execute(character_id, int(data["order"]))
        return jsonify(char.to_dict()), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # Run the Flask app on localhost, port 5000
    app.run(host='127.0.0.1', port=5000, debug=True)
