import json
from openai import OpenAI
from abc import abstractmethod
from typing import List
from .tools import ToolInterface
from .memories import Memory


class AgentInterface:
    @abstractmethod
    def add_tool(self, tool:ToolInterface):
        """
        The method for adding one tool to agent tool list.

        Parameters:
            tool (ToolInterface): tool with additional functionality
        """
        pass

    @abstractmethod
    def add_tools(self, tool:List[ToolInterface]):
        """
        The method for adding many tools to agent tool list.

        Parameters:
            tools (List[ToolInterface]): list of tools with additional functionalities
        """
        pass

    @abstractmethod
    def ask(self, question:str):
        """
        The method to ask agent a question. Agent will add question
        to chat history and invoke question to OpenAI API.

        Parameters:
            question (str): a question in text
        """
        pass


class AgentBase(AgentInterface):
    def __init__(self, client:OpenAI, memory:Memory):
        self._client = client
        self._memory = memory
        self._tools = []
        self._tools_descriptions = []

    def add_tool(self, tool):
        self._tools.append(tool)
        self._tools_descriptions.append(tool.description)

    def add_tools(self, tools:list):
        for tool in tools:
            self._tools.append(tool)
            self._tools_descriptions.append(tool.description)

    def _call_function(self, name, args):
        for tool in self._tools:
            if tool.name == name:
                return tool.use(**args)
    
    def __call__(self, question:str):
        """
        Ask a question.
        """
        return self.ask(question)


class Agent(AgentBase):
    def ask(self, question:str, model:str="gpt-4o", stream_answer:bool=False):
        self._memory.messages.append({"role": "user", "content": question})

        completion = self._client.chat.completions.create(
            model=model,
            messages=self._memory.messages,
            tools=self._tools_descriptions
        ).model_dump()

        related_sources = []

        tool_calls = completion["choices"][0]["message"]["tool_calls"]
        tool_calls = [] if tool_calls is None else tool_calls

        for tool_call in tool_calls:
            name = tool_call["function"]["name"]
            args = json.loads(tool_call["function"]["arguments"])
            self._memory.messages.append(completion["choices"][0]["message"])

            result = self._call_function(name, args)
            
            for metadata in result["metadatas"]:
                source = {}
                
                if "source" in metadata:
                    source["source"] = metadata["source"]
                if "title" in metadata:
                    source["title"] = metadata["title"]

                if "source" in source:
                    related_sources.append(source)

            self._memory.messages.append({
                "role": "tool",
                "name": name,
                "tool_call_id": tool_call["id"],
                "content": json.dumps(result["content"]),
                "metadata": json.dumps(result["metadatas"])
            })

        completion_2_stream = self._client.chat.completions.create(
            model=model,
            temperature=0,
            messages=self._memory.messages,
            stream=True
        )

        collected_messages = []

        for chunk in completion_2_stream:
            chunk_message = chunk.choices[0].delta.content
            collected_messages.append(chunk_message)

            if chunk_message is None:
                continue

            yield {"chunk": chunk_message}

        yield {"sources": related_sources}

        collected_messages = [m for m in collected_messages if m is not None]
        final_response = ''.join(collected_messages)
        self._memory.messages.append({"role": "assistant", "content": final_response})
