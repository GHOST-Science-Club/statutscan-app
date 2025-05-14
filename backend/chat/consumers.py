import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from openai import AsyncOpenAI
from chat.agent.chat_history import ChatHistory
from chat.agent.tools.chat_history import ChatHistoryTool
from chat.agent.tools.knowledge_base import KnowledgeBaseTool
from chat.agent.agent import Agent
from chat.agent.token_usage_manager import TokenUsageManager

token_usage_manager = TokenUsageManager()

client = AsyncOpenAI()
chat_history = ChatHistory()
agent = Agent(model="gpt-4o-mini")
agent.add_tools([
    ChatHistoryTool(n_last_messages=5),
    KnowledgeBaseTool(n_results=3)
])


class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_group_name = None

    async def connect(self):
        """
        Called when a WebSocket connection is initiated.
        Retrieves the chat ID from the URL, creates a corresponding group name,
        and adds the connection to the appropriate channel group. Then, accepts the connection.
        """
        user = self.scope["user"]
        if not user.is_authenticated:
            return await self.close()

        self.chat_id = self.scope["url_route"]["kwargs"]["chat_id"]

        user_email = await sync_to_async(chat_history.get_owner_email, thread_sensitive=True)(self.chat_id)
        if not user_email or user_email != user.email:
            return await self.close()
        else:
            self.user_email = user.email

        self.room_group_name = f"chat_{self.chat_id}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, code):
        """
        Called when the WebSocket connection is closed.
        Removes the connection from the corresponding channel group.
        """
        if isinstance(self.room_group_name, str) and self.room_group_name:
            await self.channel_layer.group_discard(
                self.room_group_name, self.channel_name
            )

    async def safe_send(self, content):
        try:
            await self.send(text_data=json.dumps(content))
        except Exception as e:
            print(f"Send error: {e}")
            try:
                await self.send(
                    text_data=json.dumps(
                        {
                            "type": "error",
                            "message": "An error occurred while sending a message. Please try again later.",
                        }
                    )
                )
            except Exception as nested_e:
                print(f"Connection is broken: {nested_e}")
                await self.close()

    async def receive(self, text_data):
        """
        Called when a message is received over the WebSocket.
        Parses the incoming JSON data to determine whether to handle the agent's response
        normally or quietly (e.g., for redirection scenarios).
        """
        data = json.loads(text_data)
        blocked = await sync_to_async(token_usage_manager.is_user_blocked, thread_sensitive=True)(self.user_email)
        if blocked:
            reset_date = await sync_to_async(
                token_usage_manager.get_reset_date,
                thread_sensitive=True
            )(self.user_email)
            await self.safe_send({
                "type": "token_limit_reached",
                "reset_date": reset_date,
            })
            return

        question = data.get("question")
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
            await self.safe_send(
                {"type": "assistant_answer", "message": chunk, "streaming": True}
            )

        await self.safe_send(
            {"type": "assistant_answer", "message": "DONE", "streaming": False}
        )

    async def _handle_agent_response_quietly(self):
        """
        Handles a quiet response from the agent, typically used for internal redirections.
        Sends streamed chunks silently (without an explicit question), followed by a 'DONE' signal.
        """
        async for chunk in agent.ask_quietly(self.chat_id):
            await self.safe_send(
                {"type": "assistant_answer", "message": chunk, "streaming": True}
            )

        await self.safe_send(
            {"type": "assistant_answer", "message": "DONE", "streaming": False}
        )
