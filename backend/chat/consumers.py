import os
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from openai import AsyncOpenAI
from .agent.chat_history import ChatHistory
from .agent.tools import KnowledgeBaseTool
from .agent.agent import Agent

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PERSISTENT_DIRECTORY = os.path.join(BASE_DIR, 'data', 'vector_db', 'chroma_1000signs')

client = AsyncOpenAI()
chat_history = ChatHistory()
kb_tool = KnowledgeBaseTool(PERSISTENT_DIRECTORY, "example", n_reuslts=1)
agent = Agent(client, chat_history, model="gpt-4o-mini")
agent.add_tool(kb_tool)


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """
        Called when a WebSocket connection is initiated.
        Retrieves the chat ID from the URL, creates a corresponding group name,
        and adds the connection to the appropriate channel group. Then, accepts the connection.
        """
        user = self.scope["user"]
        if not user.is_authenticated:
            return await self.close()
        
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']

        owner_email = await sync_to_async(chat_history.get_owner_email)(self.chat_id)
        if not owner_email or owner_email != user.email:
            return await self.close()
        
        self.room_group_name = f'chat_{self.chat_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, code):
        """
        Called when the WebSocket connection is closed.
        Removes the connection from the corresponding channel group.
        """
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """
        Called when a message is received over the WebSocket.
        Parses the incoming JSON data to determine whether to handle the agent's response
        normally or quietly (e.g., for redirection scenarios).
        """
        data = json.loads(text_data)
        is_redirection = data.get('is_redirection', None)

        if not is_redirection:
            question = data.get('question', None)
            await self._handle_agent_response(question)
        else:
            await self._handle_agent_response_quietly()

    async def _handle_agent_response(self, question):
        """
        Handles the main agent response to a question.
        Sends streamed chunks of the response back to the client, followed by a 'DONE' signal.
        """
        async for chunk in agent.ask(question, self.chat_id):
            await self.send(text_data=json.dumps({
                'type': 'assistant_answer',
                'message': chunk,
                'streaming': True
            }))

        await self.send(text_data=json.dumps({
            'type': 'assistant_answer',
            'message': 'DONE',
            'streaming': False
        }))

    async def _handle_agent_response_quietly(self):
        """
        Handles a quiet response from the agent, typically used for internal redirections.
        Sends streamed chunks silently (without an explicit question), followed by a 'DONE' signal.
        """
        async for chunk in agent.ask_quietly(self.chat_id):
            await self.send(text_data=json.dumps({
                'type': 'assistant_answer',
                'message': chunk,
                'streaming': True
            }))

        await self.send(text_data=json.dumps({
            'type': 'assistant_answer',
            'message': 'DONE',
            'streaming': False
        }))
