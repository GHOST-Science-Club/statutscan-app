from abc import abstractmethod
from typing import Dict


class ToolInterface:
    @abstractmethod
    def use(self):
        """
        The method to use tool.
        """
        pass

    @property
    @abstractmethod
    def name(self) -> str:
        """
        The parameter with tool name.
        """
        pass

    @property
    @abstractmethod
    def description(self) -> Dict:
        """
        The parameter with tool description in dictionary. Compatible with OpenAI API.
        """
        pass
