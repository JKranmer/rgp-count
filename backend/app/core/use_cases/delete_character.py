from app.core.repositories.character_repository import CharacterRepository


class DeleteCharacter:
    def __init__(self, repository: CharacterRepository):
        self._repository = repository

    def execute(self, character_id: str) -> None:
        existing = self._repository.get_by_id(character_id)
        if not existing:
            raise ValueError(f"Character with ID '{character_id}' not found.")
        self._repository.delete(character_id)
