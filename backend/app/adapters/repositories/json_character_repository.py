import json
import os
from typing import List, Optional
from app.core.entities.character import Character
from app.core.repositories.character_repository import CharacterRepository


class JsonCharacterRepository(CharacterRepository):
    def __init__(self, file_path: str):
        self._file_path = file_path
        self._ensure_file_exists()

    def _ensure_file_exists(self):
        directory = os.path.dirname(self._file_path)
        if directory and not os.path.exists(directory):
            os.makedirs(directory, exist_ok=True)
        if not os.path.exists(self._file_path):
            self._write_file({})

    def _read_file(self) -> dict:
        try:
            with open(self._file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return {}

    def _write_file(self, data: dict):
        with open(self._file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

    def save(self, character: Character) -> None:
        data = self._read_file()
        data[character.id] = character.to_dict()
        self._write_file(data)

    def get_by_id(self, character_id: str) -> Optional[Character]:
        data = self._read_file()
        char_data = data.get(character_id)
        if char_data:
            return Character.from_dict(char_data)
        return None

    def get_all(self) -> List[Character]:
        data = self._read_file()
        return [Character.from_dict(char_data) for char_data in data.values()]

    def delete(self, character_id: str) -> None:
        data = self._read_file()
        if character_id in data:
            del data[character_id]
            self._write_file(data)
