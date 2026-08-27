from app.core.entities.character import Character
from app.core.repositories.character_repository import CharacterRepository


class HealCharacter:
    def __init__(self, repository: CharacterRepository):
        self._repository = repository

    def execute(self, character_id: str, amount: int) -> Character:
        character = self._repository.get_by_id(character_id)
        if not character:
            raise ValueError(f"Character with ID '{character_id}' not found.")
        
        character.heal(amount)
        self._repository.save(character)
        return character
