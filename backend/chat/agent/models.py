from pydantic import BaseModel

class PromptInjection(BaseModel):
    isPromptSafe: bool
    reasoning: str